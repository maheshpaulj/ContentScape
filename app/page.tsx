"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { WobbleCard } from "@/components/ui/wobble-card";
import { Brain, Search, Share2, History, Repeat } from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { toast } from "sonner";

type Stats = {
  totalGenerations: number;
  totalUsers: number;
  totalGenerationCount: number;
};

export default function LandingPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  // Fetch statistics from API
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Error", { description: "Failed to load statistics." });
      }
    }
    fetchStats();
  }, []);

  // Animation variants for statistics container
  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="text-gray-900 dark:text-gray-100 transition-colors bg-white dark:bg-black">
      {/* Hero Section */}
      <AuroraBackground>
        <section className="text-center py-20 px-6 max-w-5xl mx-auto z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 dark:text-gray-100">
            Create Brilliant Content with{" "}
            <span className="text-blue-600 dark:text-blue-400">AI Magic</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            ContentScape: Your AI-powered writing companion for SEO-optimized
            articles, social media copy, and more.
          </p>
          <div className="flex justify-center space-x-4">
            {session ? (
              <Link href="/generate">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Try It Free
                </Button>
              </Link>
            )}
            <Link href="#features" className="dark:text-white">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </AuroraBackground>

      {/* Statistics Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12">ContentScape in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className="p-6 py-24 bg-white dark:bg-neutral-800 rounded-lg shadow-md"
          >
            <h3
              className="text-4xl font-bold text-blue-600 dark:text-blue-400"
              aria-live="polite"
            >
              {stats ? (
                <CountUp
                  end={stats.totalGenerations}
                  duration={2}
                  formattingFn={(value) => value.toLocaleString() + "+"}
                  enableScrollSpy
                  scrollSpyDelay={200}
                />
              ) : (
                "0+"
              )}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Pieces of Content Generated
            </p>
          </motion.div>
          <motion.div
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className="p-6 py-24 bg-white dark:bg-neutral-800 rounded-lg shadow-md"
          >
            <h3
              className="text-4xl font-bold text-blue-600 dark:text-blue-400"
              aria-live="polite"
            >
              {stats ? (
                <CountUp
                  end={stats.totalUsers}
                  duration={2}
                  formattingFn={(value) => value.toLocaleString() + "+"}
                  enableScrollSpy
                  scrollSpyDelay={400}
                />
              ) : (
                "0"
              )}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xl">Active Users</p>
          </motion.div>
          <motion.div
            variants={statVariants}
            initial="hidden"
            animate="visible"
            className="p-6 py-24 bg-white dark:bg-neutral-800 rounded-lg shadow-md"
          >
            <h3
              className="text-4xl font-bold text-blue-600 dark:text-blue-400"
              aria-live="polite"
            >
              {stats ? (
                <CountUp
                  end={stats.totalGenerationCount}
                  duration={2}
                  formattingFn={(value) => value.toLocaleString() + "+"}
                  enableScrollSpy
                  scrollSpyDelay={600}
                />
              ) : (
                "0"
              )}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xl">
              Total Generations by Users
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section with WobbleCard */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why ContentScape?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Feature 1: AI-Powered Content */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-blue-800 min-h-[300px]">
            <div className="max-w-xs">
              <Brain className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                AI-Powered Writing
              </h3>
              <p className="mt-4 text-base text-neutral-200">
                Generate high-quality articles, blogs, and copy using advanced AI
                models via OpenRouter API.
              </p>
            </div>
          </WobbleCard>

          {/* Feature 2: SEO Optimization */}
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-green-800">
            <Search className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              SEO Optimization
            </h3>
            <p className="mt-4 text-base text-neutral-200">
              Enhance visibility with AI-generated meta descriptions, keywords,
              and SEO tags.
            </p>
          </WobbleCard>

          {/* Feature 3: Social Media Copy */}
          <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-purple-800">
            <Share2 className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              Social Media Copy
            </h3>
            <p className="mt-4 text-base text-neutral-200">
              Create engaging tweets, captions, and ad copy tailored for maximum
              impact.
            </p>
          </WobbleCard>

          {/* Feature 4: Content History */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-800 min-h-[300px]">
            <div className="max-w-xs">
              <History className="w-12 h-12 text-white mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                Content History
              </h3>
              <p className="mt-4 text-base text-neutral-200">
                Access and manage all your generated content in one place for easy
                reference.
              </p>
            </div>
          </WobbleCard>

          {/* Feature 5: Prompt Reuse */}
          {/* <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-teal-800">
            <Repeat className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl md:text-2xl font-semibold text-white">
              Prompt Reuse
            </h3>
            <p className="mt-4 text-base text-neutral-200">
              Reuse successful prompts to generate new content quickly and
              efficiently.
            </p>
          </WobbleCard> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex items-center justify-center mb-40">
        <div className="py-20 px-6 text-center bg-neutral-900 dark:bg-neutral-800 text-white w-[90vw] rounded-xl">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Content?
          </h2>
          <p className="text-xl mb-8">
            Start using ContentScape to write smarter,
            faster, and better.
          </p>
          {session ? (
            <Link href="/generate">
              <Button
                size="lg"
                variant="outline"
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Button>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <Button
                size="lg"
                variant="outline"
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign Up Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}