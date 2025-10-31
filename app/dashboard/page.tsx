/**
 * @file dashboard/page.tsx
 * @description 대시보드 메인 페이지
 *
 * AutoList 서비스의 메인 대시보드입니다.
 * 수집된 상품 정보를 조회하고 관리할 수 있습니다.
 *
 * 주요 기능:
 * - 상품 수집 기능 (Phase 2)
 * - 상품 목록 조회
 * - 통계 정보 표시
 *
 * 디자인 참고: gongysd.com 톤앤매너 적용
 */

import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, TrendingUp, Plus } from "lucide-react";

export default function DashboardPage() {
  return (
    <SignedIn>
      <div className="min-h-screen bg-background">
        {/* 헤더 섹션 */}
        <div className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-2">대시보드</h1>
            <p className="text-muted-foreground text-lg">
              아마존 상품을 수집하고 관리하세요
            </p>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* 빠른 액션 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 상품 수집 카드 */}
            <div className="border-2 border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">상품 수집</h3>
              <p className="text-muted-foreground text-sm mb-4">
                키워드로 아마존 상품을 검색하고 수집합니다
              </p>
              <Link href="/collect">
                <Button className="w-full" variant="default">
                  수집 시작하기
                </Button>
              </Link>
            </div>

            {/* 상품 목록 카드 */}
            <div className="border-2 border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">상품 목록</h3>
              <p className="text-muted-foreground text-sm mb-4">
                수집된 상품을 조회하고 관리합니다
              </p>
              <Link href="/products">
                <Button className="w-full" variant="outline">
                  목록 보기
                </Button>
              </Link>
            </div>

            {/* 장바구니 카드 */}
            <div className="border-2 border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">장바구니</h3>
              <p className="text-muted-foreground text-sm mb-4">
                선택한 상품을 장바구니에서 확인합니다
              </p>
              <Link href="/cart">
                <Button className="w-full" variant="outline">
                  장바구니 보기
                </Button>
              </Link>
            </div>
          </div>

          {/* 통계 섹션 (Phase 3에서 구현 예정) */}
          <div className="border-2 border-border rounded-lg p-6 bg-card">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-2xl font-semibold">통계</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border-2 border-border rounded-lg">
                <div className="text-3xl font-bold mb-2">0</div>
                <div className="text-sm text-muted-foreground">수집된 상품</div>
              </div>
              <div className="text-center p-4 border-2 border-border rounded-lg">
                <div className="text-3xl font-bold mb-2">0</div>
                <div className="text-sm text-muted-foreground">카테고리</div>
              </div>
              <div className="text-center p-4 border-2 border-border rounded-lg">
                <div className="text-3xl font-bold mb-2">0</div>
                <div className="text-sm text-muted-foreground">장바구니 아이템</div>
              </div>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="mt-8 p-6 border-2 border-border rounded-lg bg-muted/30">
            <p className="text-sm text-muted-foreground">
              💡 <strong>시작하기:</strong> 먼저 "상품 수집"에서 키워드를 입력하여 상품을 수집해보세요.
              수집된 상품은 "상품 목록"에서 확인할 수 있습니다.
            </p>
          </div>
        </main>
      </div>
    </SignedIn>
  );
}

