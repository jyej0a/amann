/**
 * @file app/cart/page.tsx
 * @description 장바구니 페이지
 *
 * 현재 사용자의 장바구니 아이템을 조회하고 관리하는 페이지입니다.
 *
 * 주요 기능:
 * 1. Clerk 사용자 ID로 장바구니 아이템 조회
 * 2. 장바구니 아이템 목록 표시
 * 3. 수량 변경 기능 (향후 구현)
 * 4. 아이템 삭제 기능 (향후 구현)
 * 5. 총 가격 계산 및 표시
 *
 * @dependencies
 * - @/lib/supabase/server: Supabase 클라이언트
 * - @clerk/nextjs/server: Clerk 인증
 * - @/components/ui/card: 장바구니 아이템 카드
 * - @/components/ui/button: 버튼 컴포넌트
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default async function CartPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          <p className="text-muted-foreground">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  const supabase = createClerkSupabaseClient();

  // 장바구니 아이템 조회 (상품 정보 JOIN)
  const { data: cartItems, error } = await supabase
    .from("cart_items")
    .select(`
      *,
      products (*)
    `)
    .eq("clerk_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("장바구니 조회 오류:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">장바구니</h1>
          <p className="text-muted-foreground">장바구니를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  // 총 가격 계산
  const totalPrice = cartItems?.reduce((sum, item) => {
    const product = item.products as any;
    return sum + (parseFloat(product?.price || 0) * item.quantity);
  }, 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">장바구니</h1>
          <p className="text-muted-foreground text-lg">
            선택한 상품을 확인하고 관리하세요
          </p>
        </div>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            쇼핑 계속하기
          </Button>
        </Link>
      </div>

      {cartItems && cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = item.products as any;
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* 상품 이미지 */}
                      <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        {product?.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product?.title || "상품"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            이미지 없음
                          </div>
                        )}
                      </div>

                      {/* 상품 정보 */}
                      <div className="flex-1">
                        <Link href={`/products/${product?.id}`}>
                          <h3 className="font-semibold text-lg mb-2 hover:underline">
                            {product?.title || "상품명 없음"}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product?.category}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            ${(parseFloat(product?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            수량: {item.quantity}개
                          </span>
                        </div>
                      </div>

                      {/* 삭제 버튼 (향후 구현) */}
                      <Button variant="ghost" size="icon" disabled>
                        ✕
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* 총 가격 요약 */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">상품 개수:</span>
                  <span className="font-semibold">{cartItems.length}개</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">총 수량:</span>
                  <span className="font-semibold">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}개
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>총 금액:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full" size="lg" disabled>
                  주문하기 (구현 예정)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
          <p className="text-muted-foreground mb-6">
            상품을 장바구니에 추가해보세요.
          </p>
          <Link href="/products">
            <Button variant="default">상품 목록 보기</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

