# Flask API 서버

AutoList 아마존 상품 수집 서비스의 Flask 백엔드 서버입니다.

## 설치 및 실행

### 1. 가상환경 생성 (권장)

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate  # Windows
```

### 2. 패키지 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 값을 입력하세요:

```bash
cp .env.example .env
```

`.env` 파일 수정:
- `SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Service Role Key (RLS 우회용)

### 4. 서버 실행

```bash
python app.py
```

서버가 `http://localhost:5001`에서 실행됩니다.

> **참고**: macOS에서 포트 5000은 AirPlay Receiver가 사용할 수 있으므로, 기본값을 5001로 설정했습니다. `.env` 파일에서 `FLASK_PORT`를 변경하여 다른 포트를 사용할 수 있습니다.

## API 엔드포인트

### Health Check

```
GET /health
```

서버 상태 확인용 엔드포인트입니다.

**응답 예시:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-28T12:00:00",
  "service": "AutoList Flask API"
}
```

### 상품 수집 (Phase 2에서 구현 예정)

```
POST /api/collect-products
```

**요청 본문:**
```json
{
  "keyword": "노트북"
}
```

## 개발 환경 설정

- **Python 버전**: 3.8 이상
- **포트**: 5000 (기본값, `.env`에서 변경 가능)
- **CORS**: `http://localhost:3000` 허용 (Next.js 개발 서버)

