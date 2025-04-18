"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ArrowLeft, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { copyToClipboard, stripMarkdown } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { platforms } from "@/lib/types";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type Generation = {
  id: string;
  userEmail: string;
  prompt: string;
  platform: string;
  content: string;
  title?: string;
  seoTags?: string[];
  createdAt: string;
};

export default function GenerationDetailsPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [generation, setGeneration] = useState<Generation | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    async function fetchGeneration() {
      console.log(session?.user?.email, params.id);
      if (!session?.user?.email) {
        toast.error("Unauthorized", { description: "Please sign in to view this generation." });
        router.push("/login");
        return;
      }
  
      if (!params.id || typeof params.id !== 'string' || params.id.trim() === '') {
        toast.error("Invalid ID", { description: "The generation ID is missing or invalid." });
        router.push("/generations");
        return;
      }
  
      setLoading(true);
      try {
        const docRef = doc(db, "generations", params.id);
        const docSnap = await getDoc(docRef);
        console.log(docSnap.data());
  
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<Generation, 'id'>;
  
          if (data.userEmail !== session.user.email) {
            toast.error("Unauthorized", { description: "You don't have permission to view this generation." });
            router.push("/generations");
            return;
          }
  
          setGeneration({
            id: params.id,
            ...data
          });
        } else {
          toast.error("Not found", { description: "This generation does not exist." });
          router.push("/generations");
        }
      } catch (error) {
        console.error("Error fetching generation:", error);
        toast.error("Error", { description: "Failed to load generation." });
        router.push("/generations");
      } finally {
        setLoading(false);
      }
    }
  
    fetchGeneration();
  }, [params.id, session, router]);

  const handleCopy = (key: string, text: string, isPlainText = false) => {
    const contentToCopy = isPlainText ? stripMarkdown(text) : text;
    copyToClipboard(contentToCopy, `${isPlainText ? "Plain text" : "Content"} copied`);
    setCopiedStates((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => setCopiedStates((prev) => ({ ...prev, [key]: false })), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleDelete = async () => {
    if (!generation) return;

    try {
      await deleteDoc(doc(db, "generations", generation.id));
      toast.success("Deleted", { description: "Generation has been deleted." });
      router.push("/generations");
    } catch (error) {
      console.error("Error deleting generation:", error);
      toast.error("Error", { description: "Failed to delete generation." });
    }
  };

  const getPlatformInfo = (platformId: string) => {
    const platformData = platforms.find(p => p.id === platformId);
    return {
      icon: platformData?.icon || null,
      name: platformData?.name || platformId
    };
  };

  if (!session) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to view this generation.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto p-2 sm:p-4">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => router.push("/generations")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to all generations
        </Button>
        
        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ) : generation ? (
          <Card>
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-500">
                    {formatDate(generation.createdAt)}
                  </span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {generation.platform && getPlatformInfo(generation.platform).icon}
                    {generation.platform && getPlatformInfo(generation.platform).name}
                  </Badge>
                </div>
                <CardTitle className="text-xl sm:text-2xl font-bold break-words">
                  {generation.title || "Untitled Generation"}
                </CardTitle>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Generation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this generation? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-md font-medium mb-2">Original Prompt</h3>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                  {generation.prompt}
                </div>
              </div>
              
              {generation.title && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <h3 className="text-lg font-semibold">Title</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(`title`, generation.title!)}
                        >
                          {copiedStates[`title`] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copiedStates[`title`] ? "Copied!" : "Copy title"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                    <ReactMarkdown>{generation.title}</ReactMarkdown>
                  </div>
                </div>
              )}

              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                  <h3 className="text-lg font-semibold">Content</h3>
                  <div className="flex space-x-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy("content", generation.content)}
                        >
                          {copiedStates["content"] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copiedStates["content"] ? "Copied!" : "Copy content"}
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy("content-plain", generation.content, true)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> as plain text
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy as plain text</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
                  {generation.platform === "twitter" && generation.content.includes("\n") ? (
                    generation.content.split("\n").filter(tweet => tweet.trim()).map((tweet, index) => (
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
                                  onClick={() => handleCopy(`tweet-${index}`, tweet)}
                                >
                                  {copiedStates[`tweet-${index}`] ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {copiedStates[`tweet-${index}`] ? "Copied!" : "Copy tweet"}
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCopy(`tweet-${index}-plain`, tweet, true)}
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
                              p: ({ children }) => <p className="m-0">{children}</p>,
                              code: ({ children }) => <span className="text-sm sm:text-base">{children}</span>,
                              pre: ({ children }) => <div className="whitespace-pre-wrap break-words">{children}</div>,
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
                        {generation.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              {generation.seoTags && generation.seoTags.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">SEO Tags</h3>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(`tags`, generation.seoTags!.join(" "))}
                        >
                          {copiedStates[`tags`] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {copiedStates[`tags`] ? "Copied!" : "Copy tags"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {generation.seoTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between pt-4">
              {/* <Button 
                variant="outline" 
                onClick={() => router.push("/generator")}
              >
                Create new content
              </Button>
              <Button 
                variant="default" 
                onClick={() => {
                  router.push(`/generate?prompt=${encodeURIComponent(generation.prompt)}`);
                }}
              >
                Re-use this prompt
              </Button> */}
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-8">
              <p className="text-center">Generation not found or you don&apos;t have permission to view it.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}