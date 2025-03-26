"use client";

import { useState } from "react";
import { GeneratorForm } from "./generatorForm";
import { GeneratedContentDisplay } from "./generatedContent";
import { FormData, GeneratedContent } from "./types";
import { toast } from "sonner";

export function AIContentGenerator() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleSubmit(data: FormData) {
    if (!data.prompt.trim()) {
      toast.error("Error", {
        description: "Please enter a prompt."
      });
      return;
    }
    if (!data.platforms.length) {
      toast.error("Error", {
        description: "Please select at least one platform."
      });
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
          return {
            platform,
            content: result.content || "Error generating content",
            title: result.title,
            seoTags: result.seoTags,
          };
        })
      );
      setGeneratedContent(results);
      toast.success("Success", {
        description: "Content generated!"
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Error", {
        description: "Failed to generate content."
      });
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRegenerate(platform: string) {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...generatedContent.find((item) => item.platform === platform), platform }),
      });
      if (!response.ok) throw new Error(`Failed to regenerate for ${platform}`);
      const result = await response.json();
      setGeneratedContent((prev) =>
        prev.map((item) =>
          item.platform === platform
            ? { ...item, content: result.content, title: result.title, seoTags: result.seoTags }
            : item
        )
      );
      toast.success("Success", {
        description: `Regenerated ${platform} content!`
      });
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast.error("Error", {
        description: `Failed to regenerate ${platform}.`
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
      <GeneratorForm onSubmit={handleSubmit} isGenerating={isGenerating} />
      {generatedContent.length > 0 && (
        <GeneratedContentDisplay
          content={generatedContent}
          isGenerating={isGenerating}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
}