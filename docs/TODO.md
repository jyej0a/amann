# 🧩 AutoList 아마존 상품 수집 서비스 - 개발 TODO 리스트

PRD.md를 기반으로 작성된 개발 단계별 작업 목록입니다.

---

## 📦 Phase 1: 인프라 구축 (3일)

### ✅ 완료된 작업
- [x] Next.js + Tailwind + Shadcn 초기 세팅
- [x] Supabase 프로젝트 생성 및 스키마 정의
- [x] Clerk 로그인 연동 (Next.js 측)
- [x] 기본 레이아웃 구조 구성

### 🔨 진행 중 / 미완료 작업

- [x] Flask 서버 기본 구조 구축
  - [x] Flask 프로젝트 디렉토리 생성 (`flask-api/` 또는 `backend/`)
  - [x] `requirements.txt` 파일 생성 (Flask, supabase-py 등)
  - [x] Flask 앱 기본 설정 (`app.py` 또는 `main.py`)
  - [x] CORS 설정 (Next.js와 통신을 위해)
  - [x] 환경 변수 설정 (`.env.example` 파일)
  - [ ] Supabase 클라이언트 초기화 (Phase 2에서 구현 예정)

- [x] Flask 기본 라우팅 구축
  - [x] Health check 엔드포인트 (`GET /health`)
  - [x] 기본 에러 핸들링 미들웨어
  - [x] 로깅 설정

- [x] 기본 레이아웃 및 대시보드 구조
  - [x] 대시보드 메인 페이지 (`app/dashboard/page.tsx`)
  - [x] 네비게이션 바 개선 (장바구니 아이콘, 대시보드 링크 추가)
  - [x] 레이아웃 레이아웃 컴포넌트 (`app/dashboard/layout.tsx`)

---

## 🛒 Phase 2: 상품 수집 기능 구현 (4일)

### Flask 서버 측

- [ ] 아마존 상품 수집 API 구현
  - [ ] Mock 데이터 생성 함수 (초기 개발용)
    - [ ] 샘플 상품 데이터 생성 로직
    - [ ] 키워드/카테고리별 다른 데이터 반환
  - [ ] 실제 아마존 크롤링 로직 (선택사항, MVP에서는 Mock 우선)
    - [ ] BeautifulSoup 또는 Selenium 설정
    - [ ] 상품 정보 파싱 함수
    - [ ] 에러 핸들링 및 재시도 로직

- [ ] 상품 수집 API 엔드포인트
  - [ ] `POST /api/collect-products` 엔드포인트
    - [ ] 요청 파라미터 검증 (keyword 또는 category)
    - [ ] 수집 로직 실행
    - [ ] 응답 형식 정의 (`{ success: boolean, count: number, data: [] }`)

- [ ] Supabase 연동
  - [ ] Supabase 클라이언트 설정 (`flask-api/lib/supabase.py`)
  - [ ] 상품 저장 함수 (`insert_products()`)
    - [ ] 중복 상품 체크 로직 (detail_url 기준)
    - [ ] 배치 INSERT 처리
  - [ ] 에러 핸들링 및 로깅

### Next.js 클라이언트 측

- [ ] 상품 수집 페이지 구현
  - [ ] `app/collect/page.tsx` 페이지 생성
  - [ ] 키워드/카테고리 입력 폼 (react-hook-form + Zod)
  - [ ] "수집 실행" 버튼
  - [ ] 로딩 상태 표시
  - [ ] 성공/실패 알림 (toast 또는 dialog)

- [ ] Flask API 연동
  - [ ] API 클라이언트 함수 (`lib/api/flask-client.ts`)
    - [ ] `collectProducts(keyword: string, category?: string)` 함수
  - [ ] 에러 핸들링
  - [ ] 타임아웃 설정

- [ ] 수집 완료 후 동작
  - [ ] 수집 완료 알림 표시
  - [ ] 대시보드로 리다이렉트 또는 데이터 새로고침

---

## 📊 Phase 3: 대시보드 및 UI (4일)

### 상품 목록 페이지

- [ ] 상품 목록 페이지 (`app/products/page.tsx`)
  - [ ] Supabase에서 상품 목록 조회 (Server Component 또는 Client Component)
  - [ ] 카드형 UI 컴포넌트 (`components/product-card.tsx`)
    - [ ] 상품 이미지 표시
    - [ ] 상품명, 가격, 평점, 리뷰 수 표시
    - [ ] "상세보기" 버튼
    - [ ] "장바구니 추가" 버튼
  - [ ] 무한 스크롤 또는 페이지네이션

- [ ] 필터링/검색 기능
  - [ ] 카테고리 필터 (`components/product-filters.tsx`)
    - [ ] 카테고리 드롭다운 또는 체크박스
    - [ ] Supabase 쿼리 필터링 적용
  - [ ] 가격대 필터
    - [ ] 슬라이더 또는 입력 필드
    - [ ] 최소/최대 가격 설정
  - [ ] 검색 기능
    - [ ] 제목 검색 (Full-text search 또는 LIKE 검색)
    - [ ] 실시간 검색 또는 버튼 클릭 검색

- [ ] 정렬 기능
  - [ ] 가격순 정렬 (낮은순/높은순)
  - [ ] 평점순 정렬
  - [ ] 최신순 정렬 (created_at 기준)

### 상품 상세 페이지

- [ ] 상품 상세 페이지 (`app/products/[id]/page.tsx`)
  - [ ] 동적 라우팅 설정
  - [ ] 상품 상세 정보 표시
    - [ ] 상품 이미지 (큰 사이즈)
    - [ ] 상품명, 설명, 카테고리
    - [ ] 가격, 재고 상태, 평점, 리뷰 수
    - [ ] 아마존 상세 링크 버튼 (외부 링크)
  - [ ] "장바구니에 추가" 버튼
  - [ ] "수정" 버튼 (관리자용)
  - [ ] "삭제" 버튼 (관리자용, 확인 다이얼로그 포함)

- [ ] 상품 수정 기능
  - [ ] 상품 수정 다이얼로그/페이지 (`components/edit-product-dialog.tsx`)
  - [ ] 폼 필드 (title, description, price, stock, category 등)
  - [ ] Supabase UPDATE 쿼리 실행
  - [ ] 성공 알림 후 상세 페이지 새로고침

- [ ] 상품 삭제 기능
  - [ ] 삭제 확인 다이얼로그
  - [ ] Supabase DELETE 쿼리 실행
  - [ ] 삭제 후 상품 목록으로 리다이렉트

### 장바구니 기능

- [ ] 장바구니 페이지 (`app/cart/page.tsx`)
  - [ ] 현재 사용자의 장바구니 아이템 조회
    - [ ] `cart_items` 테이블에서 `clerk_id`로 조회
    - [ ] `products` 테이블 JOIN하여 상품 정보 표시
  - [ ] 장바구니 아이템 목록 표시
    - [ ] 상품 이미지, 이름, 가격
    - [ ] 수량 변경 입력 필드
    - [ ] 개별 아이템 삭제 버튼
    - [ ] 총 가격 계산 및 표시

- [ ] 장바구니 추가 기능
  - [ ] 상품 상세 페이지에서 "장바구니 추가" 버튼 클릭 시
  - [ ] `cart_items` 테이블에 INSERT (clerk_id, product_id, quantity)
  - [ ] 중복 상품 체크 (UNIQUE 제약 위반 시 수량 업데이트)
  - [ ] 성공 알림 표시

- [ ] 장바구니 수량 변경
  - [ ] 수량 입력 필드 변경 시
  - [ ] Supabase UPDATE 쿼리 실행
  - [ ] 총 가격 자동 재계산

- [ ] 장바구니 아이템 삭제
  - [ ] 삭제 버튼 클릭 시
  - [ ] Supabase DELETE 쿼리 실행
  - [ ] 목록에서 즉시 제거

- [ ] 네비게이션 바에 장바구니 아이콘 추가
  - [ ] 장바구니 아이템 개수 배지 표시
  - [ ] 클릭 시 장바구니 페이지로 이동

### UI 컴포넌트

- [ ] 추가 필요한 shadcn/ui 컴포넌트 설치
  - [ ] `card` - 상품 카드용
  - [ ] `select` - 필터 드롭다운용
  - [ ] `slider` - 가격대 필터용
  - [ ] `toast` 또는 `sonner` - 알림용
  - [ ] `skeleton` - 로딩 상태용
  - [ ] `badge` - 재고 상태 표시용

---

## 🔗 Phase 4: 통합 및 배포 (3일)

### 통합 테스트

- [ ] Flask ↔ Next.js API 연동 테스트
  - [ ] 상품 수집 API 엔드포인트 연결 확인
  - [ ] 에러 케이스 테스트 (네트워크 오류, 타임아웃 등)
  - [ ] CORS 설정 확인

- [ ] 데이터 CRUD 테스트
  - [ ] 상품 수집 → Supabase 저장 확인
  - [ ] 상품 목록 조회 확인
  - [ ] 상품 상세 페이지 확인
  - [ ] 상품 수정 기능 확인
  - [ ] 상품 삭제 기능 확인
  - [ ] 장바구니 추가/수정/삭제 확인

- [ ] 인증 플로우 테스트
  - [ ] Clerk 로그인 → Supabase 사용자 동기화 확인
  - [ ] 로그아웃 시 세션 정리 확인
  - [ ] 인증되지 않은 사용자 접근 차단 확인

- [ ] 전체 플로우 점검
  - [ ] 상품 수집 → 목록 표시 → 상세 확인 → 장바구니 추가 전체 플로우
  - [ ] 필터링 및 검색 기능 확인
  - [ ] 반응형 디자인 확인 (모바일/태블릿/데스크톱)

### 버그 수정 및 최적화

- [ ] 성능 최적화
  - [ ] Supabase 쿼리 최적화 (인덱스 활용 확인)
  - [ ] 이미지 lazy loading 적용
  - [ ] 페이지네이션 또는 무한 스크롤 적용

- [ ] 에러 핸들링 개선
  - [ ] 사용자 친화적인 에러 메시지
  - [ ] 에러 로깅 (콘솔 또는 외부 서비스)
  - [ ] 예외 상황 처리 (네트워크 오류, DB 오류 등)

- [ ] 접근성 개선
  - [ ] 키보드 네비게이션 지원
  - [ ] 스크린 리더 호환성 확인
  - [ ] 색상 대비 확인

### 배포 준비

- [ ] 환경 변수 설정
  - [ ] Next.js 환경 변수 확인 (`.env.local`, `.env.production`)
  - [ ] Flask 환경 변수 확인
  - [ ] Vercel 환경 변수 설정 가이드 작성

- [ ] Next.js 배포 (Vercel)
  - [ ] Vercel 프로젝트 생성 및 연결
  - [ ] 빌드 설정 확인 (`next.config.ts`)
  - [ ] 배포 스크립트 확인
  - [ ] 프로덕션 빌드 테스트 (`pnpm build`)

- [ ] Flask 배포 (Render 또는 EC2)
  - [ ] Render 배포 설정 (`render.yaml` 또는 GUI 설정)
    - [ ] 또는 EC2 배포 준비 (Docker, systemd 등)
  - [ ] 환경 변수 설정
  - [ ] Health check 엔드포인트 확인
  - [ ] 로깅 설정 확인

- [ ] 배포 후 검증
  - [ ] 프로덕션 환경에서 전체 기능 테스트
  - [ ] 성능 모니터링 (응답 시간, 에러율 등)
  - [ ] 로그 확인

### 문서화

- [ ] README.md 업데이트
  - [ ] 프로젝트 소개
  - [ ] 설치 및 실행 방법
  - [ ] 환경 변수 설정 가이드
  - [ ] 배포 가이드

- [ ] API 문서 작성 (선택사항)
  - [ ] Flask API 엔드포인트 문서
  - [ ] 요청/응답 예시

---

## 📝 추가 개선 사항 (MVP 이후)

- [ ] 자동 수집 주기 설정
  - [ ] Supabase Edge Function 또는 Cron Job 설정
  - [ ] 주기별 상품 수집 자동화

- [ ] 데이터 분석 대시보드
  - [ ] 수집된 상품 통계
  - [ ] 카테고리별 분포 차트

- [ ] Shopify 업로드 API 연동
  - [ ] Shopify API 인증
  - [ ] 상품 데이터 변환 로직
  - [ ] Shopify 상품 등록 기능

---

**작성일:** 2025-01-28  
**기준 문서:** PRD.md  
**예상 완료 기간:** 2주 (10-12일)
