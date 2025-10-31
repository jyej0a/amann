/**
 * @file app/products/[id]/page.tsx
 * @description 상품 상세 페이지
 *
 * 개별 상품의 상세 정보를 표시하는 동적 라우팅 페이지입니다.
 *
 * 주요 기능:
 * 1. 상품 ID로 상세 정보 조회
 * 2. 상품 이미지, 설명, 가격, 평점 등 표시
 * 3. 아마존 상세 링크 버튼
 * 4. 장바구니 추가 기능 (향후 구현)
 * 5. 상품 수정/삭제 기능 (관리자용, 향후 구현)
 *
 * @dependencies
 * - @/lib/supabase/server: Supabase 클라이언트
 * - @/components/ui/card: 상품 정보 카드
 * - @/components/ui/button: 버튼 컴포넌트
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, ShoppingCart } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const supabase = createClerkSupabaseClient();

  // 상품 상세 정보 조회
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <Link href="/products">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          상품 목록으로
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 상품 이미지 */}
        <div className="relative w-full h-[500px] bg-muted rounded-lg overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              이미지 없음
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{product.category}</Badge>
              {product.stock ? (
                <Badge variant="default" className="bg-green-600">
                  재고 있음
                </Badge>
              ) : (
                <Badge variant="destructive">품절</Badge>
              )}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>가격 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">${product.price}</div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>⭐ 평점: {product.rating || "N/A"}</span>
                <span>리뷰: {product.review_count || 0}개</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>상품 설명</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description || "상품 설명이 없습니다."}
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Link href={product.detail_url} target="_blank" rel="noopener noreferrer">
              <Button className="w-full" variant="default">
                <ExternalLink className="w-4 h-4 mr-2" />
                아마존에서 보기
              </Button>
            </Link>
            <Button className="w-full" variant="outline" disabled>
              <ShoppingCart className="w-4 h-4 mr-2" />
              장바구니에 추가 (구현 예정)
            </Button>
          </div>

          {/* 메타 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>상세 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 ID:</span>
                <span className="font-mono">{product.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">수집 일시:</span>
                <span>{new Date(product.created_at).toLocaleString("ko-KR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">상태:</span>
                <span>{product.status}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

