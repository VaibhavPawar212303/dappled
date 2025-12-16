"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { BookOpen, Newspaper, MonitorPlay } from "lucide-react";
import { Logo } from "./logo";


export const LandingNavbar = () => {
  return (
    <nav className="p-4 bg-white/95 backdrop-blur-sm flex items-center justify-between z-50 w-full border-b border-slate-200 fixed top-0 transition-all">
      
      {/* 1. BRAND LOGO */}
      <Link href="/" className="hover:opacity-90 transition mt-3">
        <Logo />
      </Link>

      {/* 2. NAVIGATION (Color Coded on Hover) */}
      <div className="hidden md:flex items-center gap-x-8">
        
        {/* Courses - Blue Hover */}
        <Link href="/search" className="group flex items-center gap-x-2 text-slate-600 font-medium transition hover:text-blue-600">
            <div className="p-1 rounded-md bg-slate-100 group-hover:bg-blue-100 transition">
                <MonitorPlay className="w-4 h-4 text-slate-600 group-hover:text-blue-600" />
            </div>
            Courses
        </Link>

        {/* Books - Purple Hover */}
        <Link href="/books" className="group flex items-center gap-x-2 text-slate-600 font-medium transition hover:text-purple-600">
            <div className="p-1 rounded-md bg-slate-100 group-hover:bg-purple-100 transition">
                <BookOpen className="w-4 h-4 text-slate-600 group-hover:text-purple-600" />
            </div>
            Books
        </Link>

        {/* Blogs - Emerald Hover */}
        <Link href="/blogs" className="group flex items-center gap-x-2 text-slate-600 font-medium transition hover:text-emerald-600">
            <div className="p-1 rounded-md bg-slate-100 group-hover:bg-emerald-100 transition">
                <Newspaper className="w-4 h-4 text-slate-600 group-hover:text-emerald-600" />
            </div>
            Blogs
        </Link>
      </div>

      {/* 3. AUTH BUTTONS (Black & White Style) */}
      <div className="flex items-center gap-x-2">
        <SignedIn>
            <Link href="/search">
                <Button variant="outline" size="sm" className="mr-2 border-slate-300">
                    Dashboard
                </Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
        </SignedIn>
        
        <SignedOut>
            <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                    Log in
                </Button>
            </SignInButton>
            
            <SignUpButton mode="modal">
                {/* Brand Black Button */}
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white">
                    Get Started
                </Button>
            </SignUpButton>
        </SignedOut>
      </div>
    </nav>
  );
};