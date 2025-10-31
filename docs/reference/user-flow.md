# 🎭 AutoList 유저 플로우 다이어그램

본 문서는 AutoList 아마존 상품 수집 서비스의 사용자 여정을 시각화한 것입니다.

## 📊 전체 유저 플로우

```mermaid
flowchart TD
    Start([시작]) --> Login{로그인<br/>상태 확인}
    
    Login -->|미로그인| ClerkLogin[Clerk 로그인<br/>페이지]
    Login -->|이미 로그인| Dashboard[대시보드<br/>상품 목록]
    
    ClerkLogin --> ClerkAuth{Clerk<br/>인증 성공?}
    ClerkAuth -->|실패| ClerkLogin
    ClerkAuth -->|성공| SyncUser[Supabase 사용자<br/>동기화]
    
    SyncUser --> Dashboard
    
    Dashboard --> Browse[상품 목록<br/>카드형 UI]
    
    Browse --> FilterAction{사용자<br/>액션}
    
    FilterAction -->|필터링| Filter[카테고리/가격대<br/>필터링]
    FilterAction -->|검색| Search[상품 검색]
    FilterAction -->|상품 수집| CollectProduct[상품 수집<br/>페이지]
    FilterAction -->|상품 클릭| ProductDetail[상품 상세<br/>페이지]
    FilterAction -->|장바구니| CartView[장바구니<br/>확인]
    
    Filter --> Browse
    Search --> Browse
    
    CollectProduct --> InputKeyword[키워드 또는<br/>카테고리 입력]
    InputKeyword --> TriggerFlask[Flask API 호출<br/>상품 수집 트리거]
    TriggerFlask --> FlaskProcess{Flask 서버<br/>처리}
    
    FlaskProcess -->|수집 성공| SaveSupabase[Supabase DB<br/>상품 저장]
    FlaskProcess -->|수집 실패| ErrorMsg[에러 메시지<br/>표시]
    
    SaveSupabase --> SuccessMsg[수집 완료<br/>알림]
    SuccessMsg --> Browse
    
    ErrorMsg --> CollectProduct
    
    ProductDetail --> ProductActions{상품 상세<br/>액션}
    
    ProductActions -->|아마존 링크| AmazonLink[아마존 상세<br/>페이지 이동]
    ProductActions -->|장바구니 추가| AddCart[장바구니에<br/>추가]
    ProductActions -->|상품 수정| EditProduct[상품 정보<br/>수정]
    ProductActions -->|상품 삭제| DeleteProduct[상품 삭제]
    ProductActions -->|뒤로가기| Browse
    
    AddCart --> SaveCartItem[cart_items 테이블에<br/>저장 clerk_id + product_id]
    SaveCartItem --> CartConfirm[장바구니 추가<br/>완료 알림]
    CartConfirm --> ProductDetail
    
    EditProduct --> UpdateDB[Supabase products<br/>테이블 업데이트]
    UpdateDB --> ProductDetail
    
    DeleteProduct --> DeleteConfirm{삭제<br/>확인?}
    DeleteConfirm -->|취소| ProductDetail
    DeleteConfirm -->|확인| DeleteDB[Supabase products<br/>테이블에서 삭제]
    DeleteDB --> Browse
    
    CartView --> CartActions{장바구니<br/>액션}
    
    CartActions -->|수량 변경| UpdateQuantity[cart_items<br/>수량 업데이트]
    CartActions -->|아이템 삭제| RemoveCartItem[cart_items<br/>에서 삭제]
    CartActions -->|상품 상세| ProductDetail
    
    UpdateQuantity --> CartView
    RemoveCartItem --> CartView
    
    Browse --> Logout[로그아웃]
    ProductDetail --> Logout
    CartView --> Logout
    CollectProduct --> Logout
    
    Logout --> End([종료])
    
    style Start fill:#e1f5ff
    style End fill:#ffe1e1
    style Dashboard fill:#e1ffe1
    style Browse fill:#e1ffe1
    style CollectProduct fill:#fff5e1
    style ProductDetail fill:#f0e1ff
    style CartView fill:#ffe1f5
    style ClerkLogin fill:#ffebe1
    style SaveSupabase fill:#e1f0ff
    style AddCart fill:#e1fff0
```

## 🔐 인증 플로우 상세

```mermaid
sequenceDiagram
    participant User as 사용자
    participant NextJS as Next.js<br/>Frontend
    participant Clerk as Clerk<br/>인증 서비스
    participant Supabase as Supabase<br/>Database
    
    User->>NextJS: 웹사이트 접속
    NextJS->>Clerk: 로그인 상태 확인
    
    alt 로그인 안 됨
        Clerk-->>NextJS: 미인증 상태
        NextJS-->>User: 로그인 페이지로 리다이렉트
        User->>Clerk: 로그인 정보 입력
        Clerk->>Clerk: 인증 처리
        Clerk-->>NextJS: 인증 성공 + 사용자 정보
        NextJS->>Supabase: 사용자 동기화 API 호출
        Supabase->>Supabase: users 테이블에 저장/업데이트
        Supabase-->>NextJS: 동기화 완료
        NextJS-->>User: 대시보드로 리다이렉트
    else 이미 로그인됨
        Clerk-->>NextJS: 인증된 사용자 정보
        NextJS-->>User: 대시보드 표시
    end
```

## 🛒 상품 수집 플로우 상세

```mermaid
sequenceDiagram
    participant User as 사용자
    participant NextJS as Next.js<br/>Frontend
    participant Flask as Flask<br/>Backend API
    participant Amazon as 아마존<br/>또는 Mock 데이터
    participant Supabase as Supabase<br/>Database
    
    User->>NextJS: '상품 수집하기' 버튼 클릭
    NextJS-->>User: 수집 페이지 표시
    User->>NextJS: 키워드 또는 카테고리 입력
    User->>NextJS: '수집 실행' 버튼 클릭
    
    NextJS->>Flask: POST /api/collect-products<br/>{ keyword, category }
    Flask->>Amazon: 상품 정보 수집 요청
    
    alt 수집 성공
        Amazon-->>Flask: 상품 데이터 반환
        Flask->>Flask: 데이터 가공 및 검증
        Flask->>Supabase: INSERT INTO products<br/>(title, price, image_url 등)
        Supabase-->>Flask: 저장 완료 응답
        Flask-->>NextJS: { success: true, count: N }
        NextJS-->>User: 'N개의 상품이 수집되었습니다' 알림
        NextJS->>NextJS: 대시보드 새로고침
    else 수집 실패
        Amazon-->>Flask: 에러 발생
        Flask-->>NextJS: { success: false, error: "..." }
        NextJS-->>User: 에러 메시지 표시
    end
```

## 🛍️ 장바구니 플로우 상세

```mermaid
sequenceDiagram
    participant User as 사용자
    participant NextJS as Next.js<br/>Frontend
    participant Clerk as Clerk<br/>인증
    participant Supabase as Supabase<br/>Database
    
    User->>NextJS: 상품 상세 페이지에서<br/>'장바구니 추가' 클릭
    NextJS->>Clerk: 현재 사용자의 clerk_id 조회
    Clerk-->>NextJS: clerk_id 반환
    
    NextJS->>Supabase: INSERT INTO cart_items<br/>(clerk_id, product_id, quantity=1)
    
    alt 장바구니 추가 성공
        Supabase-->>NextJS: 저장 완료
        NextJS-->>User: '장바구니에 추가되었습니다' 알림
    else 중복 상품
        Supabase-->>NextJS: UNIQUE 제약 위반 에러
        NextJS->>Supabase: UPDATE cart_items<br/>SET quantity = quantity + 1<br/>WHERE clerk_id = ? AND product_id = ?
        Supabase-->>NextJS: 수량 업데이트 완료
        NextJS-->>User: '장바구니 수량이 증가했습니다' 알림
    end
    
    User->>NextJS: 장바구니 아이콘 클릭
    NextJS->>Supabase: SELECT * FROM cart_items<br/>WHERE clerk_id = ?
    Supabase-->>NextJS: 장바구니 아이템 목록
    NextJS->>Supabase: JOIN products 테이블<br/>상품 상세 정보 조회
    Supabase-->>NextJS: 장바구니 + 상품 정보
    NextJS-->>User: 장바구니 페이지 표시
```

## 📱 주요 화면 플로우

```mermaid
flowchart LR
    subgraph "메인 화면들"
        A[로그인 페이지] --> B[대시보드]
        B --> C[상품 목록]
        C --> D[상품 상세]
        C --> E[상품 수집]
        C --> F[장바구니]
    end
    
    subgraph "대시보드 기능"
        C --> G[카테고리 필터]
        C --> H[가격대 필터]
        C --> I[검색창]
    end
    
    subgraph "상품 상세 기능"
        D --> J[아마존 링크]
        D --> K[장바구니 추가]
        D --> L[상품 수정]
        D --> M[상품 삭제]
    end
    
    subgraph "장바구니 기능"
        F --> N[수량 변경]
        F --> O[아이템 삭제]
        F --> P[상품 상세 이동]
    end
    
    style B fill:#e1ffe1
    style C fill:#e1f5ff
    style D fill:#fff5e1
    style F fill:#ffe1f5
    style E fill:#f0e1ff
```

## 🎯 주요 사용 시나리오

### 시나리오 1: 신규 상품 수집 및 확인

```
1. 사용자 로그인 (Clerk)
   ↓
2. 대시보드 진입
   ↓
3. '상품 수집하기' 버튼 클릭
   ↓
4. 키워드 입력 (예: "wireless earbuds")
   ↓
5. Flask API 호출 → 아마존 수집 → Supabase 저장
   ↓
6. 수집 완료 알림
   ↓
7. 대시보드 새로고침 → 새 상품 표시
```

### 시나리오 2: 상품 필터링 및 장바구니 추가

```
1. 대시보드에서 'Electronics' 카테고리 필터 선택
   ↓
2. 필터링된 상품 목록 표시
   ↓
3. 특정 상품 카드 클릭 → 상품 상세 페이지
   ↓
4. '장바구니에 추가' 버튼 클릭
   ↓
5. cart_items 테이블에 저장 (clerk_id + product_id)
   ↓
6. 장바구니 아이콘 클릭 → 장바구니 페이지 확인
```

### 시나리오 3: 상품 관리 (수정/삭제)

```
1. 상품 상세 페이지에서 '수정' 버튼 클릭
   ↓
2. 상품 정보 수정 (가격, 설명 등)
   ↓
3. Supabase products 테이블 UPDATE
   ↓
4. 수정 완료 알림 → 상품 상세 페이지 새로고침
   
   또는
   
1. 상품 상세 페이지에서 '삭제' 버튼 클릭
   ↓
2. 삭제 확인 다이얼로그
   ↓
3. 확인 클릭 → Supabase products 테이블 DELETE
   ↓
4. 관련 cart_items도 CASCADE 삭제
   ↓
5. 상품 목록으로 돌아감
```

---

**작성일:** 2025-01-28  
**버전:** 1.0  
**작성자:** AutoList 개발팀

