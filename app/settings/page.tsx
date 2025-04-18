"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { Settings, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to access settings.");
      router.push("/api/auth/signin");
      return;
    }

    // Load user name (if available)
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session, status, router]);

  const handleUpdateName = async () => {
    if (!session?.user?.email) return;

    try {
      await updateDoc(doc(db, "users", session.user.email), {
        name,
      });
      toast.success("Name updated successfully.");
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name.");
    }
  };

  const handleDeleteAccount = async () => {
    if (!session?.user?.email) return;

    setIsDeleting(true);
    try {
      // Delete user's generations
      const generationsQuery = query(
        collection(db, "generations"),
        where("userEmail", "==", session.user.email)
      );
      const generationsSnapshot = await getDocs(generationsQuery);
      const deletePromises = generationsSnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

      // Delete user document
      await deleteDoc(doc(db, "users", session.user.email));

      // Sign out
      await signOut({ redirect: false });
      toast.success("Account deleted successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading") {
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
    <div className="text-gray-900 dark:text-gray-100 transition-colors bg-white dark:bg-black mt-24">
      {/* Settings Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white dark:bg-neutral-800 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Update Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="dark:bg-neutral-700"
                />
                <Button
                  onClick={handleUpdateName}
                  disabled={!name.trim() || name === session.user?.name}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Update Name
                </Button>
              </div>

              {/* Delete Account */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                  Danger Zone
                </h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={isDeleting}
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Deleting your account will remove all your data, including generations, from ContentScape.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
