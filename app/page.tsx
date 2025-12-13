"use client"; 

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  MonitorPlay,
  Newspaper,
  Sparkles,
  Code,
  Globe,
  Play,
  Layers,
  Check
} from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { Logo } from "./_components/logo";
import { motion } from "framer-motion";

// Animation Variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-900 overflow-x-hidden">

      {/* ================================================== */}
      {/* 1. HERO SECTION                                    */}
      {/* ================================================== */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            New: AI-Powered Research Agent
          </motion.div>

          <motion.h1 variants={fadeIn} className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl leading-tight">
            Master Modern Tech with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Intelligent Learning
            </span>
          </motion.h1>

          <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
            The all-in-one platform for developers. Dive into interactive video courses,
            read deep-dive books, and generate market-aware technical articles with AI.
          </motion.p>

          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-md px-8 py-6 rounded-full shadow-lg hover:shadow-blue-500/20 transition-all">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/search" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-md px-8 py-6 rounded-full shadow-lg">
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </SignedIn>

            <Link href="/blogs" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-md px-8 py-6 rounded-full border-slate-300 hover:bg-slate-50">
                Read Articles
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ================================================== */}
      {/* 2. OFFERINGS GRID (Summary)                        */}
      {/* ================================================== */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Your Complete Learning Ecosystem
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We provide multiple modalities of learning because every developer learns differently.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Card 1 */}
            <motion.div variants={fadeIn} className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-16 w-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <MonitorPlay className="h-8 w-8" />
              </div>
              <h3 className="relative text-xl font-bold mb-3 text-slate-900">Video Courses</h3>
              <p className="relative text-slate-600 leading-relaxed mb-6">
                Project-based video tutorials covering full-stack development.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div variants={fadeIn} className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-16 w-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="relative text-xl font-bold mb-3 text-slate-900">Interactive Books</h3>
              <p className="relative text-slate-600 leading-relaxed mb-6">
                Deep-dive reading material with progress tracking.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div variants={fadeIn} className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Newspaper className="h-8 w-8" />
              </div>
              <h3 className="relative text-xl font-bold mb-3 text-slate-900">Tech Insights</h3>
              <p className="relative text-slate-600 leading-relaxed mb-6">
                AI-researched articles for the latest market trends.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 3. DEEP DIVE EXPLANATION (New Section)             */}
      {/* ================================================== */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          
          {/* Feature 1: Courses (Blue) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    <MonitorPlay className="h-4 w-4 mr-2" />
                    Courses
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Learn by Building Real Projects</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Stop watching tutorials that don't go anywhere. Our courses are structured around building production-ready applications from scratch.
                </p>
                <ul className="space-y-3">
                    {["Step-by-step video guidance", "Downloadable source code", "Chapter-based progress tracking"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                            <Check className="h-5 w-5 text-blue-600" />
                            {item}
                        </li>
                    ))}
                </ul>
                <Link href="/search">
                    <Button variant="link" className="text-blue-600 p-0 h-auto font-semibold mt-2">
                        Browse Video Courses &rarr;
                    </Button>
                </Link>
            </div>
            {/* Visual Mockup - Video Player */}
            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full" />
                <div className="relative aspect-video bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex items-center justify-center group">
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-blue-600 ml-1" />
                        </div>
                    </div>
                    {/* Fake UI Elements */}
                    <div className="absolute bottom-4 left-4 right-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-1/3 bg-blue-600 rounded-full" />
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Feature 2: Books (Purple) - Reverse Layout */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="flex flex-col md:flex-row-reverse items-center gap-12"
          >
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-md bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Books
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Deep Knowledge, Distraction Free</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Sometimes video isn't enough. Our interactive books allow you to read at your own pace, bookmark key concepts, and master the theory behind the code.
                </p>
                <ul className="space-y-3">
                    {["Rich text formatting with code blocks", "Lifetime access to updates", "Read anywhere, anytime"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                            <Check className="h-5 w-5 text-purple-600" />
                            {item}
                        </li>
                    ))}
                </ul>
                <Link href="/books">
                    <Button variant="link" className="text-purple-600 p-0 h-auto font-semibold mt-2">
                        Explore Library &rarr;
                    </Button>
                </Link>
            </div>
            {/* Visual Mockup - Book Reader */}
            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-purple-600/5 blur-3xl rounded-full" />
                <div className="relative aspect-[4/3] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden p-6 flex flex-col gap-4">
                    <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-2/3 bg-slate-100 rounded" />
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <div className="h-3 w-1/2 bg-purple-200 rounded mb-2" />
                        <div className="h-3 w-3/4 bg-purple-200 rounded" />
                    </div>
                </div>
            </div>
          </motion.div>

          {/* Feature 3: Blogs (Emerald) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center rounded-md bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                    <Newspaper className="h-4 w-4 mr-2" />
                    AI Articles
                </div>
                <h3 className="text-3xl font-bold text-slate-900">Stay Updated with Market Intelligence</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Technology moves fast. Our AI agents browse the web daily to create up-to-date articles, comparisons, and summaries so you don't have to doom-scroll.
                </p>
                <ul className="space-y-3">
                    {["Real-time data fetching", "Unbiased tool comparisons", "Concise, actionable insights"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700">
                            <Check className="h-5 w-5 text-emerald-600" />
                            {item}
                        </li>
                    ))}
                </ul>
                <Link href="/blogs">
                    <Button variant="link" className="text-emerald-600 p-0 h-auto font-semibold mt-2">
                        Read Latest Articles &rarr;
                    </Button>
                </Link>
            </div>
            {/* Visual Mockup - Blog List */}
            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-emerald-600/5 blur-3xl rounded-full" />
                <div className="relative aspect-video bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-100 flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-slate-200" />
                        <div className="h-3 w-3 rounded-full bg-slate-200" />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex gap-4 items-center">
                            <div className="h-12 w-12 rounded bg-emerald-100 flex-shrink-0" />
                            <div className="space-y-2 w-full">
                                <div className="h-3 w-3/4 bg-slate-200 rounded" />
                                <div className="h-2 w-1/2 bg-slate-100 rounded" />
                            </div>
                        </div>
                        <div className="flex gap-4 items-center opacity-60">
                            <div className="h-12 w-12 rounded bg-slate-100 flex-shrink-0" />
                            <div className="space-y-2 w-full">
                                <div className="h-3 w-2/3 bg-slate-200 rounded" />
                                <div className="h-2 w-1/3 bg-slate-100 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ================================================== */}
      {/* 4. FEATURE HIGHLIGHT (AI / MCP Flow)               */}
      {/* ================================================== */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl" 
          />
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute top-1/2 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl" 
          />
        </div>

        <div className="max-w-6xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 relative z-10">

          {/* Text Content */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center rounded-full bg-slate-800 border border-slate-700 px-4 py-1.5 text-sm text-blue-400 font-medium">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Google Gemini 2.0 & Tavily
            </div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Create Content at the <br /> Speed of AI
            </h2>

            <p className="text-slate-400 text-lg leading-relaxed">
              Our platform leverages agentic AI workflows (MCP) to research the web in real-time.
              Instead of relying on outdated training data, our AI browses the live internet
              to draft accurate, citation-backed tutorials and comparisons.
            </p>

            <div className="flex flex-col gap-4 pt-4">
              {[
                { icon: Globe, color: "text-emerald-500", title: "Real-time Market Research", text: "Searches top sources for latest versions." },
                { icon: Code, color: "text-purple-500", title: "Split-View Studio", text: "Compare AI draft with your final content." },
                { icon: CheckCircle, color: "text-blue-500", title: "Smart SEO Tags", text: "Auto-generate trending keywords." }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-start gap-3"
                >
                  <item.icon className={`h-6 w-6 ${item.color} mt-1`} />
                  <div>
                    <h4 className="font-semibold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-400">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual Placeholder / Mockup */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 w-full max-w-lg lg:max-w-none"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800/50 backdrop-blur-sm flex flex-col group hover:shadow-blue-500/10 transition-shadow">
              {/* Fake Browser Header */}
              <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              {/* Split View Representation */}
              <div className="flex-1 flex">
                <div className="flex-1 border-r border-slate-700 p-6 flex flex-col gap-3">
                  <div className="h-4 w-3/4 bg-slate-700 rounded animate-pulse" />
                  <div className="h-4 w-full bg-slate-700/50 rounded animate-pulse delay-75" />
                  <div className="h-4 w-5/6 bg-slate-700/50 rounded animate-pulse delay-100" />
                  <div className="h-32 w-full bg-slate-700/30 rounded mt-4 border border-slate-700 border-dashed flex items-center justify-center text-slate-500 text-sm">
                    Public Editor
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-3 bg-purple-500/5">
                  <div className="h-4 w-1/2 bg-purple-500/40 rounded" />
                  <div className="h-4 w-full bg-purple-500/20 rounded" />
                  <div className="h-4 w-full bg-purple-500/20 rounded" />
                  <div className="mt-auto p-3 bg-slate-800 rounded border border-purple-500/30 text-xs text-purple-200">
                    ✨ Generating draft from live data...
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================== */}
      {/* 5. FOOTER                                          */}
      {/* ================================================== */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:opacity-90 transition">
              <Logo />
            </Link>
          </div>

          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} TheDappled Inc. All rights reserved.
          </div>

          <div className="flex gap-8 text-sm font-medium text-slate-600">
            <Link href="#" className="hover:text-blue-600 transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-600 transition">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-600 transition">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}