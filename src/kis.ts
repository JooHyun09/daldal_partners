// 한국투자증권(KIS) OpenAPI 연동 모듈
// OAuth 토큰 발급 + 국내주식 현재가 조회

interface KisToken {
  access_token: string;
  expires_at: number; // epoch ms
}

let cachedToken: KisToken | null = null;
let tokenPromise: Promise<string | null> | null = null;

const KIS_BASE = "https://openapi.koreainvestment.com:9443";

// ── 접근토큰 발급 (캐싱 + 동시요청 시 단일 in-flight promise 공유) ──
export async function getKisToken(appKey: string, appSecret: string): Promise<string | null> {
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    return cachedToken.access_token;
  }
  // 이미 발급 중인 요청이 있으면 그 결과를 기다린다 (동시 다중발급 방지)
  if (tokenPromise) return tokenPromise;

  tokenPromise = (async () => {
    try {
      const res = await fetch(`${KIS_BASE}/oauth2/tokenP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "client_credentials",
          appkey: appKey,
          appsecret: appSecret,
        }),
      });
      if (!res.ok) return null;
      const data = await res.json<{ access_token: string; expires_in: number }>();
      cachedToken = {
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in - 300) * 1000,
      };
      return data.access_token;
    } catch {
      return null;
    } finally {
      tokenPromise = null;
    }
  })();

  return tokenPromise;
}

// ── 국내주식 현재가 조회 ──────────────────────────────
export async function getKisStockPrice(
  ticker: string,
  appKey: string,
  appSecret: string
): Promise<number | null> {
  const token = await getKisToken(appKey, appSecret);
  if (!token) return null;

  try {
    const res = await fetch(
      `${KIS_BASE}/uapi/domestic-stock/v1/quotations/inquire-price?FID_COND_MRKT_DIV_CODE=J&FID_INPUT_ISCD=${ticker}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
          appkey: appKey,
          appsecret: appSecret,
          tr_id: "FHKST01010100",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json<{ output?: { stck_prpr?: string } }>();
    const price = data.output?.stck_prpr;
    return price ? parseFloat(price) : null;
  } catch {
    return null;
  }
}
