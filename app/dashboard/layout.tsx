/**
 * @file dashboard/layout.tsx
 * @description 대시보드 레이아웃 컴포넌트
 *
 * 대시보드 페이지들을 위한 레이아웃입니다.
 * 인증된 사용자만 접근 가능하도록 설정합니다.
 *
 * 주요 기능:
 * - 대시보드 전용 레이아웃
 * - 네비게이션 포함
 *
 * @dependencies
 * - @clerk/nextjs/server: 서버 사이드 인증 확인
 * - next/navigation: 리다이렉트 기능
 */

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  // 인증되지 않은 사용자는 홈으로 리다이렉트
  if (!userId) {
    redirect("/");
  }

  return <>{children}</>;
}

