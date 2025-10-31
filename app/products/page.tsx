/**
 * @file app/products/page.tsx
 * @description 상품 목록 페이지
 *
 * 수집된 상품 목록을 카드형 UI로 표시하는 페이지입니다.
 *
 * 주요 기능:
 * 1. Supabase에서 상품 목록 조회 (최신순 정렬)
 * 2. 카드형 UI로 상품 정보 표시
 * 3. 필터링 및 검색 기능 (향후 구현)
 * 4. 무한 스크롤 또는 페이지네이션 (향후 구현)
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase 클라이언트 (공개 접근용)
 * - @/components/ui/card: 상품 카드 UI 컴포넌트
 * - @/components/ui/skeleton: 로딩 상태 UI
 * 
 * 참고: RLS가 비활성화되어 있어 공개 클라이언트(anon key)로 접근 가능합니다.
 */

import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function ProductsPage() {
  let products: any[] | null = null;
  let error: any = null;

  try {
    // 환경 변수 확인
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Supabase 환경 변수가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인해주세요."
      );
    }

    // 공개 클라이언트 생성 (RLS가 비활성화되어 있어서 공개 접근 가능)
    // Clerk 인증이 필요 없는 공개 데이터이므로 anon key로 접근
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 상품 목록 조회 (최신순 정렬)
    const result = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    products = result.data;
    error = result.error;

    // 에러 발생 시 상세 정보 로깅
    if (error) {
      console.error("상품 목록 조회 오류:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
    }
  } catch (err) {
    // 예상치 못한 에러 처리
    console.error("예상치 못한 오류 발생:", err);
    error = err instanceof Error ? err : new Error(String(err));
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">상품 목록</h1>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
            <p className="text-destructive font-medium mb-2">
              상품 목록을 불러오는 중 오류가 발생했습니다.
            </p>
            {error.message && (
              <p className="text-sm text-muted-foreground break-words">
                {error.message}
              </p>
            )}
            {error.code && (
              <p className="text-xs text-muted-foreground mt-1">
                오류 코드: {error.code}
              </p>
            )}
          </div>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link href="/dashboard">
              <Button variant="outline">대시보드로 이동</Button>
            </Link>
            <Link href="/products">
              <Button variant="default">다시 시도</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">상품 목록</h1>
        <p className="text-muted-foreground text-lg">
          수집된 상품을 확인하고 관리하세요
        </p>
      </div>

      {/* 상품 목록 그리드 */}
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden flex flex-col h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-200 border-border/50"
            >
              {/* 상품 이미지 영역 */}
              <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                    이미지 없음
                  </div>
                )}
              </div>

              {/* 카드 헤더 */}
              <CardHeader className="flex-shrink-0 pb-3">
                <CardTitle className="line-clamp-2 text-lg font-semibold mb-2 min-h-[3.5rem]">
                  {product.title}
                </CardTitle>
                <CardDescription className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground truncate">{product.category}</span>
                  <span className="text-lg font-bold text-foreground whitespace-nowrap">
                    ${product.price}
                  </span>
                </CardDescription>
              </CardHeader>

              {/* 카드 콘텐츠 */}
              <CardContent className="flex-1 flex flex-col justify-between pt-0 pb-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      ⭐ {product.rating ? product.rating.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({product.review_count || 0})
                    </span>
                  </div>
                  {product.stock ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">
                      재고 있음
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-0.5 rounded">
                      품절
                    </span>
                  )}
                </div>
                <Link href={`/products/${product.id}`} className="mt-auto">
                  <Button className="w-full" variant="outline" size="sm">
                    상세보기
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            아직 수집된 상품이 없습니다.
          </p>
          <Link href="/dashboard">
            <Button variant="default">대시보드로 이동</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

