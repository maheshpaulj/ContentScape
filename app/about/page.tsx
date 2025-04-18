"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Code, Users, Mail, Github, Brain } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function AboutPage() {
  const { data: session } = useSession();

  return (
    <div className="text-gray-900 dark:text-gray-100 transition-colors bg-white dark:bg-black">
      {/* Hero Section */}
      <AuroraBackground>
        <section className="text-center py-20 px-6 max-w-5xl mx-auto z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 dark:text-gray-100">
            About <span className="text-blue-600 dark:text-blue-400">ContentScape</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Your AI-powered companion for creating brilliant content, built by the community for the community.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
              >
                Back to Home
              </Button>
            </Link>
            <Link href="https://github.com/maheshpaulj/ContentScape" target="_blank">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Contribute on GitHub
              </Button>
            </Link>
          </div>
        </section>
      </AuroraBackground>

      {/* About ContentScape Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6">What is ContentScape?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            ContentScape is an open-source AI-powered content generation platform designed to help creators, marketers, and writers produce high-quality, SEO-optimized content effortlessly. Whether you need engaging social media posts, blog articles, or ad copy, ContentScape leverages advanced AI models via the OpenRouter API to deliver tailored results.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Powerful Features</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate SEO-optimized articles, social media copy, and more. Save your content history and reuse successful prompts for consistent results.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md">
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community-Driven</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built by a passionate community of developers and creators, ContentScape is free and open for everyone to use and improve.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Open Source Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto bg-gray-100 dark:bg-neutral-900">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6">Open Source & Collaborative</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            ContentScape is proudly open-source, licensed under the MIT License, and hosted on GitHub. We believe in the power of collaboration to make the app better for everyone. Whether you're a developer, designer, or content creator, your contributions can shape the future of ContentScape.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md">
              <Code className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Contribute Code</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Fork the repository, add new features, fix bugs, or improve the UI. Submit a pull request to share your work with the community.
              </p>
              <Link href="https://github.com/maheshpaulj/ContentScape" target="_blank">
                <Button
                  variant="outline"
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                >
                  <Github className="w-5 h-5 mr-2" /> View on GitHub
                </Button>
              </Link>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-md max-w-md">
              <Mail className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Share Feedback</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Have ideas for new features or improvements? Reach out to us via email or open an issue on GitHub.
              </p>
              <a href="mailto:mahesh.paul.j@gmail.com">
                <Button
                  variant="outline"
                  className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                >
                  <Mail className="w-5 h-5 mr-2" /> Contact Us
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-4xl font-bold mb-6">Join the ContentScape Community</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Help us make ContentScape the best tool for content creators worldwide. Contribute, share, and create with us!
          </p>
          <div className="flex justify-center space-x-4">
            {session ? (
              <Link href="/generate">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Start Creating
                </Button>
              </Link>
            ) : (
              <Link href="/api/auth/signin">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Sign Up Free
                </Button>
              </Link>
            )}
            <Link href="https://github.com/maheshpaulj/ContentScape" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
              >
                Contribute Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
