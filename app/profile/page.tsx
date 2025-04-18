"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { User, BarChart2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

type UserStats = {
  totalGenerations: number;
  favoritePlatform: string;
};

type Generation = {
  id: string;
  prompt: string;
  platform: string;
  content: string;
  createdAt: string;
};

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentGenerations, setRecentGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to view your profile.");
      router.push("/api/auth/signin");
      return;
    }

    async function fetchUserData() {
      if (!session?.user?.email) return;

      setLoading(true);
      try {
        // Fetch user generations
        const generationsQuery = query(
          collection(db, "generations"),
          where("userEmail", "==", session.user.email),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const generationsSnapshot = await getDocs(generationsQuery);

        // Calculate stats
        const totalGenerations = generationsSnapshot.size;
        const platformCounts: Record<string, number> = {};
        generationsSnapshot.forEach((doc) => {
          const data = doc.data();
          platformCounts[data.platform] = (platformCounts[data.platform] || 0) + 1;
        });
        const favoritePlatform = Object.entries(platformCounts).reduce(
          (a, b) => (b[1] > a[1] ? b : a),
          ["none", 0]
        )[0];

        // Set recent generations
        const generations = generationsSnapshot.docs.map((doc) => ({
          id: doc.id,
          prompt: doc.data().prompt,
          platform: doc.data().platform,
          content: doc.data().content,
          createdAt: doc.data().createdAt,
        }));

        setStats({ totalGenerations, favoritePlatform });
        setRecentGenerations(generations);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchUserData();
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="text-gray-900 dark:text-gray-100 transition-colors bg-white dark:bg-black">
      {/* Hero Section */}
        <section className="text-center py-20 px-6 max-w-5xl mx-auto mt-12">
          <h1 className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
            Welcome, {session?.user?.name}! Explore your content creation journey.
          </h1>
          <div className="flex justify-center space-x-4">
            <Link href="/generate">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Create New Content
              </Button>
            </Link>
            <Link href="/generations">
              <Button size="lg" variant="outline">
                View All Generations
              </Button>
            </Link>
          </div>
        </section>

      {/* User Stats Section */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-12">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Total Generations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 py-12">
                  {stats?.totalGenerations || 0}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-neutral-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Favorite Platform
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 py-12">
                  {stats?.favoritePlatform || "None"}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      {/* Recent Generations Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={statVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-12">Recent Generations</h2>
          {recentGenerations.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300">
              No generations yet. Start creating now!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentGenerations.map((gen) => (
                <motion.div
                  key={gen.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="bg-white dark:bg-neutral-800">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{gen.prompt}</span>
                        <Badge variant="outline">{gen.platform}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {gen.content}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Created: {new Date(gen.createdAt).toLocaleDateString()}
                      </p>
                      <Link href={`/generations/${gen.id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}
