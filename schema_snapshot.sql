-- 일별 자산 스냅샷 (Cron이 매일 기록)
CREATE TABLE IF NOT EXISTS daily_snapshot (
  date TEXT PRIMARY KEY,           -- 'YYYY-MM-DD'
  fin_value_krw REAL NOT NULL,     -- 금융자산 총 평가금액
  fin_cost_krw REAL NOT NULL,      -- 금융자산 총 매입금액
  net_worth_krw REAL NOT NULL,     -- 순자산 (금융자산+부동산-대출)
  fx_rate REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
