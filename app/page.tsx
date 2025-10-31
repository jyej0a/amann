/**
 * @file app/page.tsx
 * @description AutoList 메인 페이지 (gongysd.com 톤앤매너 적용)
 *
 * 아마존 상품 수집 서비스 AutoList의 랜딩 페이지입니다.
 * gongysd.com/mission 페이지의 디자인 톤앤매너를 적용했습니다.
 *
 * 디자인 특징:
 * - 검은색 얇은 테두리 (border-2 border-black)
 * - 무드 그린 색상 강조 (#9CAF88)
 * - 연한 오프화이트/크림 배경
 * - 위트있는 텍스트와 이모지
 * - 필(pill) 형태의 버튼
 *
 * @dependencies
 * - @clerk/nextjs: 인증 상태 확인
 * - next/link: 페이지 네비게이션
 */

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#FAF9F6]">
      {/* Hero 섹션 */}
      <section className="w-full max-w-5xl mx-auto px-8 py-16 lg:py-24">
        <div className="flex flex-col gap-8 items-center text-center">
          {/* 메인 타이틀 */}
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-black">
              AutoList
            </h1>
            <p className="text-xl lg:text-2xl text-black leading-relaxed max-w-2xl">
              우리가 상품 수집에 집착하는 이유는 단순합니다.
              <br />
              &apos;효율&apos;은 결국 &apos;자동화&apos;에서 나오니까요.
            </p>
          </div>

          {/* 강조 박스 - gongysd 스타일 */}
          <div className="w-full max-w-2xl border-2 border-black rounded-lg bg-[#9CAF88] p-6 flex items-center justify-center gap-3">
            <p className="text-white font-bold text-lg lg:text-xl">
              그것이 우리가 존재하는 이유입니다!
            </p>
            <span className="text-2xl">😎</span>
          </div>

          {/* CTA 버튼 - 필 형태 */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <SignedOut>
              <Link href="/sign-in">
                <button className="px-8 py-4 bg-black text-white font-bold rounded-full border-2 border-black hover:bg-[#9CAF88] hover:border-[#9CAF88] transition-colors text-lg">
                  시작하기
                </button>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <button className="px-8 py-4 bg-[#9CAF88] text-white font-bold rounded-full border-2 border-black hover:bg-[#7A9469] transition-colors text-lg">
                  대시보드로 이동
                </button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="border-t-2 border-black max-w-5xl mx-auto my-8"></div>

      {/* 주요 기능 소개 섹션 */}
      <section className="w-full max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12 text-black">
          주요 기능
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 기능 카드 1: 상품 수집 */}
          <div className="border-2 border-black rounded-lg p-6 bg-white">
            <h3 className="text-2xl font-bold mb-3 text-black">상품 수집</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              키워드만 입력하면 아마존 상품을 자동으로 검색하고 수집합니다.
              <br />
              수동으로 하나씩 찾을 필요 없어요. 😊
            </p>
          </div>

          {/* 기능 카드 2: 데이터 저장 */}
          <div className="border-2 border-black rounded-lg p-6 bg-white">
            <h3 className="text-2xl font-bold mb-3 text-black">데이터 저장</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              수집된 상품 정보를 Supabase에 안전하게 저장하고 관리합니다.
              <br />
              언제든지 조회하고 수정할 수 있어요.
            </p>
          </div>

          {/* 기능 카드 3: 대시보드 */}
          <div className="border-2 border-black rounded-lg p-6 bg-white">
            <h3 className="text-2xl font-bold mb-3 text-black">대시보드</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              수집된 상품을 카드형 UI로 확인하고 필터링할 수 있습니다.
              <br />
              보기 좋게 정리되어 있어요.
            </p>
          </div>

          {/* 기능 카드 4: 자동화 */}
          <div className="border-2 border-black rounded-lg p-6 bg-white">
            <h3 className="text-2xl font-bold mb-3 text-black">자동화 준비</h3>
            <p className="text-gray-700 text-base leading-relaxed">
              향후 Shopify 업로드 및 주기적 수집 자동화로 확장 가능합니다.
              <br />
              시간이 날 때마다 자동으로 수집해요.
            </p>
          </div>
        </div>
      </section>

      {/* 구분선 */}
      <div className="border-t-2 border-black max-w-5xl mx-auto my-8"></div>

      {/* 사용 안내 섹션 */}
      <section className="w-full max-w-5xl mx-auto px-8 py-12">
        <div className="border-2 border-black rounded-lg p-8 lg:p-12 bg-[#FFF8E7]">
          <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black">
            어떻게 시작하나요?
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-lg text-black font-medium">
            <li>로그인 후 대시보드로 이동합니다</li>
            <li>상품 수집에서 키워드를 입력하고 수집을 실행합니다</li>
            <li>수집된 상품을 목록에서 확인하고 관리합니다</li>
            <li>필요한 상품을 장바구니에 추가하여 정리합니다</li>
          </ol>
          <p className="mt-6 text-base text-gray-700">
            💡 <strong>팁:</strong> 처음 사용하시나요? 걱정 마세요. 몇 번만 클릭하면 바로 시작할 수 있어요!
          </p>
        </div>
      </section>

      {/* 마지막 강조 메시지 */}
      <section className="w-full max-w-5xl mx-auto px-8 py-12">
        <div className="border-2 border-black rounded-lg p-8 bg-[#9CAF88] text-center">
          <p className="text-white font-bold text-xl lg:text-2xl mb-2">
            NO PAIN, YES GAIN!
          </p>
          <p className="text-white/90 text-base">
            수동 작업은 이제 그만.
            <br />
            AutoList로 상품 수집을 자동화하고 시간을 절약하세요.
          </p>
        </div>
      </section>
    </main>
  );
}
