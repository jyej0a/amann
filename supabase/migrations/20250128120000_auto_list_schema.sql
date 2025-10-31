-- =====================================================
-- AutoList 아마존 상품 수집 서비스 - 데이터베이스 스키마
-- =====================================================
-- 
-- 설명:
--   - 아마존 상품 수집 서비스 MVP를 위한 PostgreSQL 스키마
--   - Clerk 인증 시스템과 통합 (clerk_id 사용)
--   - RLS 비활성화 (개발 환경)
--   - updated_at 자동 업데이트 트리거 포함
--   - 성능 최적화를 위한 인덱스 포함
--   - 샘플 데이터 포함
--
-- 주요 테이블:
--   1. products: 수집된 아마존 상품 정보
--   2. cart_items: 장바구니 아이템 (Clerk 사용자 기반)
--
-- 작성일: 2025-01-28
-- =====================================================

-- =====================================================
-- 1. EXTENSIONS (필요한 확장 기능 활성화)
-- =====================================================

-- UUID 생성 함수 사용을 위한 확장 (PostgreSQL 기본 제공)
-- gen_random_uuid() 사용을 위해 필요

-- =====================================================
-- 2. ENUM 타입 정의
-- =====================================================

-- 상품 상태 enum (향후 확장을 위해)
CREATE TYPE product_status AS ENUM (
    'active',
    'inactive',
    'out_of_stock',
    'discontinued'
);

-- =====================================================
-- 3. PRODUCTS 테이블 (메인 상품 정보)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.products (
    -- 기본 식별자
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- 상품 기본 정보 (PRD 반영)
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    
    -- 이미지 및 링크
    image_url TEXT,
    detail_url TEXT NOT NULL, -- 아마존 상품 상세 링크
    
    -- 가격 정보
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    
    -- 재고 및 상태
    stock BOOLEAN DEFAULT true NOT NULL,
    status product_status DEFAULT 'active' NOT NULL,
    
    -- 평점 및 리뷰
    rating NUMERIC(3, 2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    
    -- 메타데이터
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.products OWNER TO postgres;

-- RLS 명시적 비활성화 (PRD 요구사항 반영)
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.products TO anon;
GRANT ALL ON TABLE public.products TO authenticated;
GRANT ALL ON TABLE public.products TO service_role;

-- =====================================================
-- 4. CART_ITEMS 테이블 (장바구니 기능)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.cart_items (
    -- 기본 식별자
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Clerk 사용자 ID (TEXT 타입)
    clerk_id TEXT NOT NULL,
    
    -- 상품 참조 (외래키)
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    
    -- 수량
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    
    -- 메타데이터
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    
    -- 한 사용자가 동일 상품을 중복으로 담지 않도록 제약
    UNIQUE(clerk_id, product_id)
);

-- 테이블 소유자 설정
ALTER TABLE public.cart_items OWNER TO postgres;

-- RLS 명시적 비활성화 (PRD 요구사항 반영)
ALTER TABLE public.cart_items DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.cart_items TO anon;
GRANT ALL ON TABLE public.cart_items TO authenticated;
GRANT ALL ON TABLE public.cart_items TO service_role;

-- =====================================================
-- 5. PERFORMANCE INDEXES (성능 최적화)
-- =====================================================

-- Products 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON public.products(rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_title_search ON public.products USING gin(to_tsvector('english', title));

-- Cart Items 테이블 인덱스
CREATE INDEX IF NOT EXISTS idx_cart_items_clerk_id ON public.cart_items(clerk_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON public.cart_items(created_at DESC);

-- =====================================================
-- 6. UPDATED_AT 자동 업데이트 트리거 함수
-- =====================================================

-- updated_at 자동 업데이트를 위한 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Products 테이블에 트리거 적용
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Cart Items 테이블에 트리거 적용
CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON public.cart_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 7. SAMPLE DATA (개발용 샘플 데이터 20개)
-- =====================================================

-- 카테고리: Electronics, Home & Kitchen, Sports & Outdoors, Clothing, Books 등 다양하게
INSERT INTO public.products (
    title,
    description,
    category,
    image_url,
    detail_url,
    price,
    stock,
    status,
    rating,
    review_count
) VALUES
-- Electronics 카테고리 (5개)
(
    'Wireless Bluetooth Earbuds - Premium Sound Quality',
    'High-quality wireless earbuds with noise cancellation, 30-hour battery life, and crystal-clear audio. Perfect for workouts and daily commutes.',
    'Electronics',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    'https://www.amazon.com/dp/B08XYZ1234',
    89.99,
    true,
    'active',
    4.5,
    3247
),
(
    '4K Ultra HD Smart TV 55 Inch',
    'Samsung 55-inch 4K UHD Smart TV with HDR, voice assistant, and streaming apps. Crystal-clear picture quality and immersive viewing experience.',
    'Electronics',
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1',
    'https://www.amazon.com/dp/B08XYZ1235',
    599.99,
    true,
    'active',
    4.7,
    8921
),
(
    'Laptop Stand - Ergonomic Aluminum Desktop Riser',
    'Adjustable laptop stand made from premium aluminum. Improves posture and desk organization. Compatible with 13-17 inch laptops.',
    'Electronics',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    'https://www.amazon.com/dp/B08XYZ1236',
    39.99,
    true,
    'active',
    4.3,
    1542
),
(
    'Portable Bluetooth Speaker - Waterproof',
    'Rugged waterproof Bluetooth speaker with 360° sound and 24-hour battery. Perfect for outdoor adventures and pool parties.',
    'Electronics',
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    'https://www.amazon.com/dp/B08XYZ1237',
    79.99,
    true,
    'active',
    4.6,
    5234
),
(
    'Smart Watch Fitness Tracker',
    'Feature-rich smartwatch with heart rate monitor, GPS, sleep tracking, and 7-day battery life. Water-resistant and compatible with iOS and Android.',
    'Electronics',
    'https://images.unsplash.com/photo-1544117519-31a4b719223d',
    'https://www.amazon.com/dp/B08XYZ1238',
    199.99,
    true,
    'active',
    4.4,
    6789
),
-- Home & Kitchen 카테고리 (4개)
(
    'Stainless Steel Coffee Maker - 12 Cup Programmable',
    'Professional-grade coffee maker with programmable timer, auto-shutoff, and keep-warm feature. Brews up to 12 cups of perfect coffee.',
    'Home & Kitchen',
    'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
    'https://www.amazon.com/dp/B08XYZ1239',
    49.99,
    true,
    'active',
    4.5,
    4321
),
(
    'Premium Non-Stick Cookware Set - 10 Pieces',
    'Complete cookware set with non-stick coating, dishwasher-safe, and oven-safe up to 400°F. Includes pots, pans, and lids.',
    'Home & Kitchen',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d',
    'https://www.amazon.com/dp/B08XYZ1240',
    129.99,
    true,
    'active',
    4.6,
    5678
),
(
    'Air Fryer - 6 Quart Digital Display',
    'Large capacity air fryer with digital controls, rapid air technology, and preset cooking functions. Healthier fried foods with 75% less fat.',
    'Home & Kitchen',
    'https://images.unsplash.com/photo-1556911220-bff31c812dba',
    'https://www.amazon.com/dp/B08XYZ1241',
    89.99,
    true,
    'active',
    4.7,
    9123
),
(
    'Memory Foam Mattress Topper - Queen Size',
    '2-inch gel-infused memory foam topper for enhanced comfort and support. Cooling gel layer prevents overheating during sleep.',
    'Home & Kitchen',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
    'https://www.amazon.com/dp/B08XYZ1242',
    69.99,
    true,
    'active',
    4.4,
    3456
),
-- Sports & Outdoors 카테고리 (4개)
(
    'Yoga Mat - Extra Thick Non-Slip Exercise Mat',
    'Eco-friendly yoga mat with superior grip, 6mm thickness for joint protection, and carrying strap included. Perfect for yoga, pilates, and workouts.',
    'Sports & Outdoors',
    'https://images.unsplash.com/photo-1601925260368-ae2f83d496f8',
    'https://www.amazon.com/dp/B08XYZ1243',
    29.99,
    true,
    'active',
    4.5,
    7890
),
(
    'Hiking Backpack - 40L Water Resistant',
    'Lightweight hiking backpack with rain cover, hydration system compatible, and adjustable straps. Multiple compartments for organized packing.',
    'Sports & Outdoors',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    'https://www.amazon.com/dp/B08XYZ1244',
    79.99,
    true,
    'active',
    4.6,
    2345
),
(
    'Adjustable Dumbbells Set - 50lbs Each',
    'Space-saving adjustable dumbbells with quick-change weight system. Range from 5-50lbs per dumbbell. Perfect for home gym workouts.',
    'Sports & Outdoors',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    'https://www.amazon.com/dp/B08XYZ1245',
    299.99,
    true,
    'active',
    4.4,
    4567
),
(
    'Running Shoes - Lightweight Athletic Sneakers',
    'Breathable mesh running shoes with cushioned sole, arch support, and durable outsole. Perfect for daily runs and training.',
    'Sports & Outdoors',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    'https://www.amazon.com/dp/B08XYZ1246',
    89.99,
    false,
    'out_of_stock',
    4.3,
    6789
),
-- Clothing 카테고리 (3개)
(
    'Classic Cotton T-Shirt - Pack of 3',
    'Premium cotton blend t-shirts in assorted colors. Soft, breathable, and machine washable. Perfect for everyday wear.',
    'Clothing',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
    'https://www.amazon.com/dp/B08XYZ1247',
    24.99,
    true,
    'active',
    4.2,
    1234
),
(
    'Denim Jacket - Classic Fit',
    'Timeless denim jacket with button closure and chest pockets. 100% cotton denim. Versatile layering piece for any season.',
    'Clothing',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    'https://www.amazon.com/dp/B08XYZ1248',
    59.99,
    true,
    'active',
    4.4,
    5678
),
(
    'Comfortable Leggings - High Waist Yoga Pants',
    'Stretchy high-waist leggings with moisture-wicking fabric. Perfect for yoga, workouts, or casual wear. Available in multiple colors.',
    'Clothing',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
    'https://www.amazon.com/dp/B08XYZ1249',
    34.99,
    true,
    'active',
    4.5,
    9012
),
-- Books 카테고리 (2개)
(
    'The Complete Guide to Web Development - 2025 Edition',
    'Comprehensive guide covering HTML, CSS, JavaScript, React, and modern web development practices. Includes practical examples and projects.',
    'Books',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e',
    'https://www.amazon.com/dp/B08XYZ1250',
    49.99,
    true,
    'active',
    4.6,
    3456
),
(
    'Productivity Hacks: Time Management for Professionals',
    'Evidence-based strategies for maximizing productivity and managing time effectively. Includes worksheets and actionable tips.',
    'Books',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765',
    'https://www.amazon.com/dp/B08XYZ1251',
    19.99,
    true,
    'active',
    4.3,
    2345
),
-- Toys & Games 카테고리 (1개)
(
    'Educational Building Blocks Set - 500 Pieces',
    'Colorful building blocks set for creative play. Develops fine motor skills and spatial awareness. Compatible with major block brands.',
    'Toys & Games',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    'https://www.amazon.com/dp/B08XYZ1252',
    39.99,
    true,
    'active',
    4.7,
    7890
),
-- Beauty & Personal Care 카테고리 (1개)
(
    'Vitamin C Serum - Anti-Aging Face Serum',
    'Potent vitamin C serum with hyaluronic acid for brighter, smoother skin. Reduces fine lines and dark spots. Suitable for all skin types.',
    'Beauty & Personal Care',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be',
    'https://www.amazon.com/dp/B08XYZ1253',
    29.99,
    true,
    'active',
    4.5,
    4567
);

-- =====================================================
-- 8. COMMENTS (테이블 및 컬럼 설명)
-- =====================================================

COMMENT ON TABLE public.products IS '아마존에서 수집된 상품 정보를 저장하는 테이블';
COMMENT ON COLUMN public.products.id IS '상품 고유 식별자 (UUID)';
COMMENT ON COLUMN public.products.title IS '상품명';
COMMENT ON COLUMN public.products.description IS '상품 상세 설명';
COMMENT ON COLUMN public.products.category IS '상품 카테고리';
COMMENT ON COLUMN public.products.image_url IS '상품 대표 이미지 URL';
COMMENT ON COLUMN public.products.detail_url IS '아마존 상품 상세 페이지 링크';
COMMENT ON COLUMN public.products.price IS '상품 가격 (USD)';
COMMENT ON COLUMN public.products.stock IS '재고 보유 여부';
COMMENT ON COLUMN public.products.status IS '상품 상태 (active, inactive, out_of_stock, discontinued)';
COMMENT ON COLUMN public.products.rating IS '상품 평점 (0.0 ~ 5.0)';
COMMENT ON COLUMN public.products.review_count IS '리뷰 개수';
COMMENT ON COLUMN public.products.created_at IS '데이터 수집/생성 일시';
COMMENT ON COLUMN public.products.updated_at IS '데이터 수정 일시 (트리거로 자동 업데이트)';

COMMENT ON TABLE public.cart_items IS 'Clerk 인증 사용자의 장바구니 아이템을 저장하는 테이블';
COMMENT ON COLUMN public.cart_items.id IS '장바구니 아이템 고유 식별자 (UUID)';
COMMENT ON COLUMN public.cart_items.clerk_id IS 'Clerk 사용자 ID (TEXT 타입)';
COMMENT ON COLUMN public.cart_items.product_id IS '상품 ID (products 테이블 외래키)';
COMMENT ON COLUMN public.cart_items.quantity IS '장바구니에 담은 상품 수량';
COMMENT ON COLUMN public.cart_items.created_at IS '장바구니 추가 일시';
COMMENT ON COLUMN public.cart_items.updated_at IS '장바구니 아이템 수정 일시 (트리거로 자동 업데이트)';

-- =====================================================
-- 완료 메시지
-- =====================================================

-- 마이그레이션 완료 확인용
DO $$
BEGIN
    RAISE NOTICE 'AutoList 스키마 마이그레이션이 성공적으로 완료되었습니다.';
    RAISE NOTICE '- Products 테이블: 생성 완료';
    RAISE NOTICE '- Cart Items 테이블: 생성 완료';
    RAISE NOTICE '- 인덱스: 생성 완료';
    RAISE NOTICE '- 트리거: 생성 완료';
    RAISE NOTICE '- 샘플 데이터: 20개 추가 완료';
    RAISE NOTICE '- RLS: 비활성화 상태';
END $$;

