"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GeneratedContent, platforms } from "@/lib/types";
import { copyToClipboard, stripMarkdown } from "@/lib/utils";

type GeneratedContentProps = {
  content: GeneratedContent[];
  isGenerating: boolean;
  onRegenerate: (platform: string) => void;
};

export function GeneratedContentDisplay({ content, isGenerating, onRegenerate }: GeneratedContentProps) {
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  const handleCopy = (key: string, text: string, isPlainText = false) => {
    const contentToCopy = isPlainText ? stripMarkdown(text) : text;
    copyToClipboard(contentToCopy, `${isPlainText ? "Plain text" : "Content"} copied`);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000);
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold">Generated Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={content[0]?.platform} className="w-full">
            <TabsList className="flex gap-1 sm:gap-2 mb-4 justify-start overflow-y-auto h-full">
              {content.map((item) => (
                <TabsTrigger
                  key={item.platform}
                  value={item.platform}
                  className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 whitespace-nowrap"
                >
                  {platforms.find((p) => p.id === item.platform)?.icon}{" "}
                  {platforms.find((p) => p.id === item.platform)?.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {content.map((item) => (
              <TabsContent key={item.platform} value={item.platform} className="space-y-4">
                {item.title && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                      <h3 className="text-lg font-semibold">Title</h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(`${item.platform}-title`, item.title!)}
                          >
                            {copiedStates[`${item.platform}-title`] ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedStates[`${item.platform}-title`] ? "Copied!" : "Copy title"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                      <ReactMarkdown>{item.title}</ReactMarkdown>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <h3 className="text-lg font-semibold">Content</h3>
                    {item.platform !== "twitter" && (
                      <div className="flex space-x-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(item.platform, item.content)}
                              disabled={isGenerating}
                            >
                              {copiedStates[item.platform] ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedStates[item.platform] ? "Copied!" : "Copy content"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(`${item.platform}-plain`, item.content, true)}
                              disabled={isGenerating}
                            >
                              <Copy className="h-4 w-4 mr-1" /> as plain text
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Copy as plain text</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onRegenerate(item.platform)}
                              disabled={isGenerating}
                            >
                              <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Regenerate</TooltipContent>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                    {item.platform === "twitter" && item.content.includes("\n") ? (
                      item.content.split("\n").filter(tweet => tweet.trim()).map((tweet, index) => (
                        <div
                          key={index}
                          className="mb-2 p-2 bg-gray-200 dark:bg-gray-700 rounded space-y-2"
                        >
                          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2">
                            <div className="flex space-x-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(`${item.platform}-${index}`, tweet)}
                                    disabled={isGenerating}
                                  >
                                    {copiedStates[`${item.platform}-${index}`] ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {copiedStates[`${item.platform}-${index}`] ? "Copied!" : "Copy tweet"}
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCopy(`${item.platform}-${index}-plain`, tweet, true)}
                                    disabled={isGenerating}
                                  >
                                    <Copy className="h-4 w-4 mr-1" /> as plain text
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Copy as plain text</TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                          <div className="text-sm sm:text-base break-words whitespace-pre-wrap w-full">
                            <ReactMarkdown
                              components={{
                                p: ({ children }) => <p className="m-0">{children}</p>, // Force paragraph rendering
                                code: ({ children }) => <span className="text-sm sm:text-base">{children}</span>, // Override code blocks
                                pre: ({ children }) => <div className="whitespace-pre-wrap break-words">{children}</div>, // Override pre tags
                              }}
                            >
                              {tweet}
                            </ReactMarkdown>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm sm:text-base break-words whitespace-pre-wrap">
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p className="mb-2">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                            li: ({ children }) => <li className="mb-1">{children}</li>,
                            h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-bold mb-2">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-lg sm:text-xl font-semibold mb-2">{children}</h2>,
                          }}
                        >
                          {item.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>

                {(item.seoTags && item.seoTags.length > 0) || item.platform === "blog" ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">SEO Tags</h3>
                      {item.seoTags && item.seoTags.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(`${item.platform}-tags`, item.seoTags!.join(" "))}
                            >
                              {copiedStates[`${item.platform}-tags`] ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {copiedStates[`${item.platform}-tags`] ? "Copied!" : "Copy tags"}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.seoTags && item.seoTags.length > 0 ? (
                        item.seoTags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No tags generated</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}