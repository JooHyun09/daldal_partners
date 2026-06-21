-- 고정자산 (부동산/대출)
INSERT INTO fixed_assets (category, name, value_krw, note) VALUES
  ('real_estate', '센트라스아파트 127동 1805호 (59F)', 1880000000, '서울 성동구 왕십리로 410'),
  ('mortgage', '주담대', -405000000, '3.3% 고정, 40년납, 월201만, 중도상환수수료 면제 2027.08.19, 변동전환 2029.08');

-- 현금성 자산
INSERT INTO holdings (account, account_label, market, ticker, name, quantity, avg_price, currency, is_cash, cash_value_krw) VALUES
  ('parking', '파킹통장', 'KR', NULL, '파킹통장', 1, 0, 'KRW', 1, 3000000),
  ('dc_pension', 'DC형퇴직연금(미래에셋대우)', 'KR', NULL, '방치중(원리금보장형 추정)', 1, 0, 'KRW', 1, 29537392);

-- 홈런랩 (Wrap 8-20) - 주요 종목
INSERT INTO holdings (account, account_label, market, ticker, name, quantity, avg_price, currency) VALUES
  ('homerun_wrap', '홈런랩', 'US', NULL, 'DIREXION MU DAILY 2X', 1, 84443, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '루멘텀 홀딩스', 2, 406686, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '마블 테크놀로지 그룹', 5, 144967, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, 'ROUNDHILL MEMORY', 35, 56508, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, 'DIREXION SEMICONDUCTOR', 2, 208497, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '로켓 랩', 3, 88322, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '네비우스 그룹', 10, 276682, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', 'NVDA', '엔비디아', 4, 269008, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, 'LEVERAGE SHARES NBIS', 13, 42012, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, 'GLOBAL X ARTIFICIAL(AIQ)', 3, 93086, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '테라울프', 7, 39959, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, 'LEVERAGE SHARES CRWV', 3, 59975, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '코어위브', 6, 186065, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '제타 글로벌 홀딩스', 24, 38095, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, 'TRADR LITE DAILY 2X', 15, 71251, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '팔란티어 테크', 2, 230722, 'KRW'),
  ('homerun_wrap', '홈런랩', 'US', NULL, '외화예수금(USD)', 1, 60026, 'KRW');

-- 미래에셋대우 - 국내주식
INSERT INTO holdings (account, account_label, market, ticker, name, quantity, avg_price, currency) VALUES
  ('mirae_asset', '미래에셋', 'KR', NULL, 'PLUS 글로벌HBM반도체', 18, 59572, 'KRW'),
  ('mirae_asset', '미래에셋', 'KR', NULL, '현대무벡스', 13, 31373, 'KRW'),
  ('mirae_asset', '미래에셋', 'KR', NULL, 'TIGER KRX금현물', 40, 15413, 'KRW'),
  ('mirae_asset', '미래에셋', 'KR', NULL, '셀트리온', 2, 204000, 'KRW'),
  ('mirae_asset', '미래에셋', 'KR', NULL, '한국항공우주', 2, 190000, 'KRW');

-- 미래에셋대우 - 해외주식 (USD 단가)
INSERT INTO holdings (account, account_label, market, ticker, name, quantity, avg_price, currency) VALUES
  ('mirae_asset', '미래에셋', 'US', 'SMH', 'VANECK SEMICONDUCTOR', 1, 417.32, 'USD'),
  ('mirae_asset', '미래에셋', 'US', 'AIQ', 'GLOBAL X ARTIFICIAL', 4, 52.38, 'USD'),
  ('mirae_asset', '미래에셋', 'US', 'JEPQ', 'JP MORGAN EQ PREM', 5, 58.15, 'USD'),
  ('mirae_asset', '미래에셋', 'US', 'TSLA', '테슬라', 1, 434.50, 'USD');
