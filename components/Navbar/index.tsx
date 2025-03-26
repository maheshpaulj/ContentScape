// components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Moon, Sun, User, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = useSession();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Trigger glass effect after 10px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-700"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200"
            >
              ContentScape
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white no-underline transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white no-underline transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/generate"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white no-underline transition-colors duration-200"
            >
              Generate
            </Link>
          </div>

          {/* Right Section (Desktop) */}
          <div className="hidden sm:flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {session.user?.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="no-underline w-full cursor-pointer">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="no-underline w-full cursor-pointer">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-generations" className="no-underline w-full cursor-pointer">
                      My Generations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <p
                      onClick={() => signOut()}
                      className="no-underline w-full text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 cursor-pointer"
                    >
                      Logout
                    </p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" onClick={() => signIn("google")}>
                Sign In
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Toggle menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:hidden">
                <div className="flex flex-col space-y-4 mt-4">
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white no-underline transition-colors duration-200"
                    onClick={closeSheet}
                  >
                    Home
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white no-underline transition-colors duration-200"
                    onClick={closeSheet}
                  >
                    About
                  </Link>
                  <Link
                    href="/generate"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white no-underline transition-colors duration-200"
                    onClick={closeSheet}
                  >
                    Generate
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        <User className="h-5 w-5 mr-2" />
                        My Account
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="no-underline w-full" onClick={closeSheet}>
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="no-underline w-full" onClick={closeSheet}>
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/my-generations" className="no-underline w-full" onClick={closeSheet}>
                          My Generations
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/logout"
                          className="no-underline w-full text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                          onClick={closeSheet}
                        >
                          Logout
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 mr-2" />
                    ) : (
                      <Moon className="h-5 w-5 mr-2" />
                    )}
                    Toggle Theme
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}