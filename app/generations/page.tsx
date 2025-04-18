"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { collection, query, where, orderBy, getDocs, DocumentData } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Laptop, ArrowRight, Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { platforms } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

export default function GenerationsPage() {
  const { data: session } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [filteredGenerations, setFilteredGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const router = useRouter();

  // Define platform options with proper fallbacks
  const platformOptions = platforms.map(platform => ({
    id: platform.id,
    name: platform.name || platform.id,
    icon: platform.icon || null
  }));

  useEffect(() => {
    async function fetchGenerations() {
      if (!session?.user?.email) return;
      
      setLoading(true);
      try {
        const q = query(
          collection(db, "generations"),
          where("userEmail", "==", session.user.email),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const generationsList: Generation[] = [];
        
        querySnapshot.forEach((doc) => {
          generationsList.push({
            id: doc.id,
            ...doc.data() as Omit<Generation, 'id'>
          });
        });
        
        setGenerations(generationsList);
        setFilteredGenerations(generationsList);
      } catch (error) {
        console.error("Error fetching generations:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchGenerations();
  }, [session]);

  // Apply filters when search query or platform selections change
  useEffect(() => {
    let results = [...generations];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        gen => 
          gen.prompt.toLowerCase().includes(query) || 
          (gen.title && gen.title.toLowerCase().includes(query)) ||
          (gen.content && gen.content.toLowerCase().includes(query)) ||
          (gen.seoTags && gen.seoTags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Filter by selected platforms
    if (selectedPlatforms.length > 0) {
      results = results.filter(gen => selectedPlatforms.includes(gen.platform));
    }
    
    setFilteredGenerations(results);
  }, [searchQuery, selectedPlatforms, generations]);
  
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
  
  const getPlatformName = (platformId: string) => {
    const platform = platformOptions.find(p => p.id === platformId);
    return platform ? platform.name : platformId;
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platformOptions.find(p => p.id === platformId);
    return platform ? platform.icon : null;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedPlatforms([]);
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(current => 
      current.includes(platformId)
        ? current.filter(id => id !== platformId)
        : [...current, platformId]
    );
  };

  if (!session) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Please sign in to view your content generations.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-4 mt-24">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle className="text-xl sm:text-2xl font-bold">Your Generated Content</CardTitle>
            <Button 
              variant="default" 
              onClick={() => router.push("/generate")}
            >
              Create New Content
            </Button>
          </div>
        </CardHeader>

        {!loading && generations.length > 0 && (
          <CardContent className="pb-2">
            <div className="flex flex-col sm:flex-row gap-2 mb-4 items-start sm:items-center">
              <div className="relative w-full sm:w-auto sm:flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search generations..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex-shrink-0">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {selectedPlatforms.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {selectedPlatforms.length}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">Platforms</div>
                    <Separator />
                    <ScrollArea className="h-72">
                      {platformOptions.map((platform) => (
                        <DropdownMenuCheckboxItem
                          key={platform.id}
                          checked={selectedPlatforms.includes(platform.id)}
                          onCheckedChange={() => handlePlatformToggle(platform.id)}
                          className="flex items-center gap-2"
                        >
                          {platform.icon}
                          {platform.name}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </ScrollArea>
                    <Separator />
                    <div className="p-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-center"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </Button>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {(searchQuery || selectedPlatforms.length > 0) && (
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="text-sm text-gray-500">
                  Showing {filteredGenerations.length} of {generations.length} generations
                </div>
                {(searchQuery || selectedPlatforms.length > 0) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        )}
        
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : generations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">You haven&apos;t generated any content yet.</p>
              <Button 
                variant="default" 
                onClick={() => router.push("/generate")}
              >
                Create your first content
              </Button>
            </div>
          ) : filteredGenerations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">No generations match your filters.</p>
              <Button 
                variant="outline" 
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGenerations.map((generation) => (
                <Card 
                  key={generation.id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/generations/${generation.id}`)}
                >
                  <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-lg truncate">
                      {generation.title || generation.prompt.substring(0, 60) + (generation.prompt.length > 60 ? "..." : "")}
                    </h3>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(generation.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Laptop className="h-4 w-4 mr-1" />
                        <span className="flex items-center gap-1">
                          {getPlatformIcon(generation.platform)}
                          {getPlatformName(generation.platform)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-wrap gap-2">
                        {generation.seoTags && generation.seoTags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                        {generation.seoTags && generation.seoTags.length > 3 && (
                          <Badge variant="outline">+{generation.seoTags.length - 3} more</Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
        
        {filteredGenerations.length > 10 && (
          <CardFooter className="pt-2 flex justify-center">
            <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to top
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}