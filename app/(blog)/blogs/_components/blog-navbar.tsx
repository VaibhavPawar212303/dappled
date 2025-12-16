"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs"; // ✅ Import these
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/app/_components/logo";

export const BlogNavbar = () => {
    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm max-w-6xl mx-auto">
            {/* Left Side: Brand */}
            <div className="flex items-center gap-x-4">
                <Link href="/blogs" className="font-bold text-xl text-slate-700">
                   <Logo/>
                </Link>
            </div>

            {/* Right Side: Auth State */}
            <div className="ml-auto flex items-center gap-x-4">
                
                {/* 1. Show this if user IS logged in */}
                <SignedIn>
                    <Link href="/search">
                         <Button size="sm" variant="ghost">
                            Dashboard
                         </Button>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>

                {/* 2. Show this if user is NOT logged in (Guest) */}
                <SignedOut>
                    <Link href="/sign-in">
                        <Button size="sm" variant="outline">
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                        </Button>
                    </Link>
                </SignedOut>
            </div>
        </div>
    )
}