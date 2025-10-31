import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Home } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto border-b">
      <Link href="/" className="text-2xl font-bold">
        AutoList
      </Link>
      <div className="flex gap-4 items-center">
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <Home className="w-4 h-4 mr-2" />
              대시보드
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="sm">
              <ShoppingCart className="w-4 h-4 mr-2" />
              장바구니
            </Button>
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>로그인</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
