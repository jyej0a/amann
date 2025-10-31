# Vercel 배포 가이드

이 문서는 Amazon Crawling 프로젝트를 Vercel에 배포하는 방법을 단계별로 안내합니다.

## 📋 배포 전 체크리스트

배포하기 전에 다음 사항들을 확인하세요:

- ✅ 모든 환경 변수가 로컬 `.env` 파일에 제대로 설정되어 있는지
- ✅ Supabase 프로젝트가 생성되고 마이그레이션이 적용되었는지
- ✅ Clerk 프로젝트가 생성되고 설정이 완료되었는지
- ✅ Git 저장소에 변경사항이 커밋되어 있는지

## 🚀 배포 방법

Vercel에 배포하는 방법은 두 가지가 있습니다:

### 방법 1: Vercel 웹 인터페이스 사용 (추천)

가장 쉬운 방법입니다. Vercel 웹사이트에서 직접 배포할 수 있습니다.

#### 1단계: Vercel 계정 생성

1. [Vercel 웹사이트](https://vercel.com)에 접속합니다
2. **"Sign Up"** 버튼을 클릭합니다
3. GitHub, GitLab, 또는 Bitbucket 계정으로 로그인합니다 (GitHub 추천)

#### 2단계: 프로젝트 연결

1. Vercel 대시보드에서 **"Add New..."** → **"Project"** 클릭
2. Git 저장소 선택 (GitHub/GitLab/Bitbucket)
3. 저장소를 찾아서 **"Import"** 클릭

#### 3단계: 프로젝트 설정

Vercel이 자동으로 Next.js 프로젝트를 감지하므로, 대부분 설정이 자동으로 완료됩니다:

- **Framework Preset**: Next.js (자동 선택됨)
- **Root Directory**: `./` (기본값 유지)
- **Build Command**: `pnpm build` (자동 감지)
- **Output Directory**: `.next` (기본값 유지)
- **Install Command**: `pnpm install` (자동 감지)

#### 4단계: 환경 변수 설정 (중요!)

**⚠️ 가장 중요한 단계입니다!** 로컬 `.env` 파일의 모든 환경 변수를 Vercel에 추가해야 합니다.

1. 프로젝트 설정 화면에서 **"Environment Variables"** 섹션으로 스크롤
2. 각 환경 변수를 하나씩 추가합니다:

```
# Clerk 환경 변수
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL

# Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STORAGE_BUCKET
```

3. 각 변수 입력 시:
   - **Key**: 변수 이름 (예: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
   - **Value**: 실제 값 (로컬 `.env` 파일에서 복사)
   - **Environment**: `Production`, `Preview`, `Development` 모두 선택 (또는 `Production`만 선택)

4. **"Add"** 버튼을 클릭하여 추가합니다

#### 5단계: 배포 실행

1. 모든 환경 변수 추가가 완료되면 **"Deploy"** 버튼을 클릭합니다
2. 빌드 진행 상황을 확인할 수 있습니다
3. 빌드가 완료되면 배포 URL이 생성됩니다 (예: `https://your-project.vercel.app`)

#### 6단계: Clerk 웹훅 설정 (필수!)

배포가 완료된 후, Clerk에서 프로덕션 URL을 등록해야 합니다:

1. [Clerk Dashboard](https://dashboard.clerk.com)에 접속
2. 프로젝트 선택 → **Webhooks** 메뉴
3. **"Add Endpoint"** 클릭
4. 다음 정보 입력:
   - **Endpoint URL**: `https://your-project.vercel.app/api/sync-user`
     (실제 Vercel 배포 URL로 교체)
   - **Events**: 필요한 이벤트 선택 (최소한 `user.created`, `user.updated` 선택)
5. **"Create"** 클릭

### 방법 2: Vercel CLI 사용

터미널에서 직접 배포하는 방법입니다.

#### 1단계: Vercel CLI 설치

```bash
pnpm add -g vercel
```

#### 2단계: Vercel 로그인

```bash
vercel login
```

브라우저가 열리면 Vercel 계정으로 로그인합니다.

#### 3단계: 프로젝트 배포

프로젝트 루트 디렉토리에서 실행:

```bash
vercel
```

첫 배포 시:
- **"Set up and deploy"** 선택
- 프로젝트 이름 입력 (또는 Enter로 기본값 사용)
- 설정 질문에 답변 (대부분 기본값으로 진행 가능)

#### 4단계: 환경 변수 추가

CLI로 환경 변수를 추가할 수도 있지만, 웹 인터페이스에서 추가하는 것이 더 편리합니다.

```bash
# 예시 (실제로는 웹 인터페이스에서 추가하는 것을 권장)
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

#### 5단계: 프로덕션 배포

```bash
vercel --prod
```

## 🔧 배포 후 확인 사항

배포가 완료된 후 다음을 확인하세요:

1. **홈페이지 접속 확인**
   - 배포된 URL로 접속하여 홈페이지가 정상적으로 보이는지 확인

2. **인증 테스트**
   - `/auth-test` 페이지로 이동하여 Clerk 로그인이 작동하는지 확인
   - 로그인 후 사용자 정보가 제대로 표시되는지 확인

3. **데이터베이스 연결 확인**
   - Supabase Dashboard에서 데이터베이스 접속 로그 확인
   - 사용자 동기화가 정상적으로 작동하는지 확인

4. **환경 변수 확인**
   - Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
   - 모든 환경 변수가 올바르게 설정되어 있는지 확인

## 🐛 문제 해결

### 빌드 오류가 발생하는 경우

1. **로컬에서 빌드 테스트**
   ```bash
   pnpm build
   ```
   로컬에서 빌드가 실패하면 Vercel에서도 실패합니다.

2. **환경 변수 확인**
   - Vercel 대시보드에서 모든 환경 변수가 설정되었는지 확인
   - 특히 `NEXT_PUBLIC_`로 시작하는 변수들이 있는지 확인

3. **빌드 로그 확인**
   - Vercel 대시보드 → Deployments → 실패한 배포 클릭
   - Build Logs 탭에서 오류 메시지 확인

### 인증이 작동하지 않는 경우

1. **Clerk 환경 변수 확인**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`와 `CLERK_SECRET_KEY`가 올바른지 확인

2. **Clerk 웹훅 설정 확인**
   - Clerk Dashboard에서 웹훅 URL이 올바른지 확인

3. **브라우저 콘솔 확인**
   - 브라우저 개발자 도구 (F12) → Console 탭에서 오류 메시지 확인

### 데이터베이스 연결 오류

1. **Supabase 환경 변수 확인**
   - `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 확인

2. **Supabase RLS 정책 확인**
   - Supabase Dashboard → Authentication → Policies
   - 필요한 정책이 설정되어 있는지 확인

## 📝 추가 참고 사항

### 커스텀 도메인 설정

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 안내에 따라 도메인 제공업체에서 설정

### 환경별 배포

- **Production**: 프로덕션 환경 (메인 도메인)
- **Preview**: Pull Request마다 자동 생성되는 미리보기 환경
- **Development**: 개발 브랜치 배포 환경

각 환경별로 다른 환경 변수를 설정할 수 있습니다.

### 빌드 시간 최적화

- Vercel은 자동으로 빌드 캐시를 관리합니다
- `pnpm-lock.yaml`이 커밋되어 있어야 의존성 캐싱이 최적화됩니다

## 🎉 완료!

배포가 성공적으로 완료되면, 이제 전 세계 어디서나 접속할 수 있는 웹 애플리케이션이 완성되었습니다!

추가 질문이나 문제가 있으면 언제든지 문의하세요.

