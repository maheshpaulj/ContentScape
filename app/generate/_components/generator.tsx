"use client";

import { useState } from "react";
import { GeneratorForm } from "./generatorForm";
import { GeneratedContentDisplay } from "./generatedContent";
import { FormData, GeneratedContent } from "@/lib/types";
import { toast } from "sonner";
import { doc, setDoc, increment, updateDoc } from "firebase/firestore";
import { db, analytics } from "@/lib/firebase";
import { logEvent } from "firebase/analytics";
import { useSession } from "next-auth/react";

// Utility function to generate a random string for unique IDs
function generateRandomString(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function AIContentGenerator() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: session } = useSession();

  async function handleSubmit(data: FormData) {
    if (!data.prompt.trim()) {
      toast.error("Error", { description: "Please enter a prompt." });
      return;
    }
    if (!data.platforms.length) {
      toast.error("Error", { description: "Please select at least one platform." });
      return;
    }
    if (!session?.user?.email) {
      toast.error("Error", { description: "Please sign in to generate content." });
      return;
    }

    setIsGenerating(true);
    try {
      const results = await Promise.all(
        data.platforms.map(async (platform) => {
          const response = await fetch("/api/generate-content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, platform }),
          });
          if (!response.ok) throw new Error(`Failed to generate for ${platform}`);
          const result = await response.json();

          // Generate a URL-safe generation ID without email
          const generationId = `${Date.now()}-${platform}-${generateRandomString(8)}`;
          await setDoc(doc(db, "generations", generationId), {
            userEmail: session.user?.email,
            prompt: data.prompt,
            platform,
            content: result.content || "Error generating content",
            title: result.title || "",
            seoTags: result.seoTags || [],
            createdAt: new Date().toISOString(),
          });

          await updateDoc(doc(db, "users", session.user?.email!), {
            generationCount: increment(1),
          });

          logEvent(analytics!, "content_generated", {
            platform,
            user_email: session.user?.email,
            prompt_length: data.prompt.length,
          });

          return {
            platform,
            content: result.content || "Error generating content",
            title: result.title,
            seoTags: result.seoTags,
            prompt: data.prompt, // Include prompt in the result
          };
        })
      );
      setGeneratedContent(results);
      toast.success("Success", { description: "Content generated!" });
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Error", { description: "Failed to generate content." });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRegenerate(platform: string) {
    if (!session?.user?.email) {
      toast.error("Error", { description: "Please sign in to regenerate content." });
      return;
    }

    setIsGenerating(true);
    try {
      const existing = generatedContent.find((item) => item.platform === platform);
      if (!existing) throw new Error(`No existing content for ${platform}`);

      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, platform }), // Includes prompt now
      });
      if (!response.ok) throw new Error(`Failed to regenerate for ${platform}`);
      const result = await response.json();

      // Generate a URL-safe generation ID without email
      const generationId = `${Date.now()}-${platform}-${generateRandomString(8)}`;
      await setDoc(doc(db, "generations", generationId), {
        userEmail: session.user.email,
        prompt: existing.prompt || "Regenerated",
        platform,
        content: result.content || "Error generating content",
        title: result.title || "",
        seoTags: result.seoTags || [],
        createdAt: new Date().toISOString(),
      });

      setGeneratedContent((prev) =>
        prev.map((item) =>
          item.platform === platform
            ? {
                ...item,
                content: result.content || "Error generating content",
                title: result.title,
                seoTags: result.seoTags,
              }
            : item
        )
      );
      toast.success("Success", { description: `Regenerated ${platform} content!` });
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast.error("Error", { description: `Failed to regenerate ${platform}.` });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      {session ? (
        <>
          <GeneratorForm onSubmit={handleSubmit} isGenerating={isGenerating} />
          {generatedContent.length > 0 && (
            <GeneratedContentDisplay
              content={generatedContent}
              isGenerating={isGenerating}
              onRegenerate={handleRegenerate}
            />
          )}
        </>
      ) : (
        <p>Please sign in to generate content.</p>
      )}
    </div>
  );
}