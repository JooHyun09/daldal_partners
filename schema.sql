-- 보유 종목 테이블 (수동 입력: 계좌구분, 종목, 수량, 매입가)
CREATE TABLE IF NOT EXISTS holdings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account TEXT NOT NULL,           -- 'homerun_wrap' | 'mirae_asset' | 'dc_pension' | 'parking'
  account_label TEXT NOT NULL,     -- '홈런랩' | '미래에셋' | 'DC형퇴직연금' | '파킹통장'
  market TEXT NOT NULL,            -- 'KR' | 'US'
  ticker TEXT,                     -- 'NVDA', '005930' 등 (현금성은 NULL)
  name TEXT NOT NULL,              -- 종목명
  quantity REAL NOT NULL DEFAULT 0,
  avg_price REAL NOT NULL DEFAULT 0,  -- 평균 매입단가
  currency TEXT NOT NULL DEFAULT 'KRW', -- 'KRW' | 'USD'
  is_cash INTEGER NOT NULL DEFAULT 0,   -- 1이면 현금성 자산 (시세조회 불필요)
  cash_value_krw REAL DEFAULT 0,        -- 현금성 자산일 때 원화 가치
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 시세 캐시 테이블 (API 호출 줄이기 위함, 일정 시간마다 갱신)
CREATE TABLE IF NOT EXISTS price_cache (
  ticker TEXT PRIMARY KEY,
  market TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 부동산/대출 등 비유동 자산 (수동 관리)
CREATE TABLE IF NOT EXISTS fixed_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,    -- 'real_estate' | 'mortgage'
  name TEXT NOT NULL,
  value_krw REAL NOT NULL,
  note TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 환율 캐시
CREATE TABLE IF NOT EXISTS fx_cache (
  pair TEXT PRIMARY KEY,   -- 'USDKRW'
  rate REAL NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
