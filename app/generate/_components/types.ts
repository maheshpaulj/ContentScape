export type FormData = {
    prompt: string;
    platforms: string[];
    tone: string;
    audience: string;
    useAdvancedSettings: boolean;
    includeHashtags: boolean;
    includeEmojis: boolean;
    contentLength: string;
  };
  
  export type GeneratedContent = {
    platform: string;
    content: string;
    title?: string;
    seoTags?: string[];
  };
  
  export const platforms = [
    { id: "twitter", name: "Twitter (X)", icon: "🐦" },
    { id: "twitter-pro", name: "Twitter Pro", icon: "🐦+" },
    { id: "facebook", name: "Facebook", icon: "📘" },
    { id: "instagram", name: "Instagram", icon: "📷" },
    { id: "linkedin", name: "LinkedIn", icon: "💼" },
    { id: "youtube", name: "YouTube", icon: "🎥" },
    { id: "blog", name: "Blog", icon: "📝" },
    { id: "tiktok", name: "TikTok", icon: "🎵" },
    { id: "pinterest", name: "Pinterest", icon: "📌" },
  ];
  
  export const tones = [
    "Professional",
    "Casual",
    "Humorous",
    "Inspirational",
    "Educational",
    "Promotional",
  ];
  
  export const audienceTypes = [
    "General",
    "B2B",
    "B2C",
    "Technical",
    "Creative",
    "Academic",
  ];
  
  export const contentLengths = [
    { id: "short", name: "Short" },
    { id: "medium", name: "Medium" },
    { id: "long", name: "Long" },
  ];