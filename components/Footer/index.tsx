// components/Footer.tsx
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, Github, ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  // Show/hide back-to-top button based on scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-neutral-100 dark:bg-black text-neutral-600 dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-700 py-12 px-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product Links */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="/generate"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                Generate
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Contact</h3>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
              <a
                href="mailto:mahesh.paul.j@gmail.com"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                mahesh.paul.j@gmail.com
              </a>
            </li>
            <li className="flex items-center space-x-2">
              <Github className="h-5 w-5 text-neutral-500 dark:text-neutral-300" />
              <a
                href="https://github.com/maheshpaulj/contentscape"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">ContentScape</h3>
          <p className="text-sm">
            Empowering creators with AI-driven content solutions. Built with ❤️ for the web.
          </p>
        </div>
      </div>

      {/* Divider and Copyright */}
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} ContentScape. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0 space-x-4">
        </div>
      </div>

      {/* Back to Top Button */}
      {isVisible && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-600"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </footer>
  );
}