"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="text-gray-900 dark:text-gray-100 transition-colors  bg-white dark:bg-black">
      {/* Hero Section */}
      <AuroraBackground>
      <section className="text-center py-20 px-6 max-w-5xl mx-auto z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 dark:text-gray-100">
          Create Brilliant Content with <span className="text-blue-600 dark:text-blue-400">AI Magic</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          ContentScape: Your AI-powered writing companion for SEO-optimized articles, social media copy, and more.
        </p>
        <div className="flex justify-center space-x-4">
          {session ? (
            <Link href="/generate">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Get Started
              </Button>
            </Link>
          ) : (
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Try It Free
              </Button>
          )}
          <Link href="#features" className="dark:text-white">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </div>
      </section>
      </AuroraBackground>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Why ContentScape?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1: AI-Powered Content */}
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Image src="/ai-content.svg" alt="AI Content" width={64} height={64} className="mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">AI-Powered Writing</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Generate high-quality content effortlessly with free LLMs via OpenRouter API.
            </p>
          </div>

          {/* Feature 2: SEO Optimization */}
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Image src="/seo.svg" alt="SEO" width={64} height={64} className="mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">SEO Optimization</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Boost visibility with meta descriptions, keyword suggestions, and readability scores.
            </p>
          </div>

          {/* Feature 3: Social Media & Marketing */}
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Image src="/social-media.svg" alt="Social Media" width={64} height={64} className="mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">Social Media Copy</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Craft tweets, ad copies, and captions tailored for maximum engagement.
            </p>
          </div>

          {/* Feature 4: Plagiarism Checker */}
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Image src="/plagiarism.svg" alt="Plagiarism" width={64} height={64} className="mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">Plagiarism Checker</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Ensure originality with AI-powered content analysis.
            </p>
          </div>

          {/* Feature 5: Light/Dark Mode */}
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <Image src="/theme.svg" alt="Theme" width={64} height={64} className="mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-center">Customizable Themes</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Work comfortably with light or dark mode, tailored to your preference.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex items-center justify-center mb-40">
        <div className="py-20 px-6 text-center bg-blue-600 dark:bg-blue-800 text-white max-w-6xl rounded-xl">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Content?</h2>
          <p className="text-xl mb-8">
            Join thousands of creators using ContentScape to write smarter, faster, and better.
          </p>
          {session ? (
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-100">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
              <Button size="lg" variant="outline" className="text-blue-600 bg-white hover:bg-gray-100">
                Sign Up Free
              </Button>
          )}
        </div>

      </section>
    </div>
  );
}