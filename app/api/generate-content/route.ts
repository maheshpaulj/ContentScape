import { NextRequest, NextResponse } from "next/server";

type Platform = 
  | "twitter" 
  | "twitter-pro" 
  | "facebook" 
  | "instagram" 
  | "linkedin" 
  | "youtube" 
  | "blog" 
  | "tiktok" 
  | "pinterest";

type RequestBody = {
  prompt: string;
  platform: Platform;
  tone: string;
  audience: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  contentLength: "short" | "medium" | "long";
};

type GenerationResponse = {
  content: string;
  title?: string;
  seoTags?: string[];
};

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();
    const { 
      prompt, 
      platform, 
      tone, 
      audience, 
      includeHashtags, 
      includeEmojis, 
      contentLength 
    } = body;

    if (!prompt || !platform) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Platform-specific configurations
    const platformConfig: Record<Platform, { prompt: string; includeTitle: boolean; maxTokens: number }> = {
      twitter: {
        prompt: `Create a Twitter thread about: ${prompt}. Split into multiple tweets, each under 280 characters. Number each tweet (e.g., "1/3: text"). ${includeEmojis ? "Use lots of emojis (e.g., 🎉, 🚀, 😊)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text, no markdown. Return as a single string with newlines separating tweets.`,
        includeTitle: false,
        maxTokens: 512,
      },
      "twitter-pro": {
        prompt: `Create a Twitter post about: ${prompt}. No character limit (Pro version). ${includeEmojis ? "Use lots of emojis (e.g., 🎉, 🚀, 😊)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text, no markdown.`,
        includeTitle: false,
        maxTokens: 1024,
      },
      facebook: {
        prompt: `Create a Facebook post about: ${prompt}. ${contentLength === "short" ? "1 paragraph" : contentLength === "medium" ? "1-2 paragraphs" : "2-3 paragraphs"}. ${includeEmojis ? "Use lots of emojis (e.g., 🎉, 😍, 👍)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text with **bold** for emphasis.`,
        includeTitle: false,
        maxTokens: contentLength === "short" ? 512 : contentLength === "medium" ? 1024 : 2048,
      },
      instagram: {
        prompt: `Create an Instagram caption about: ${prompt}. ${contentLength === "short" ? "1-2 sentences" : contentLength === "medium" ? "3-4 sentences" : "5-6 sentences"}. ${includeEmojis ? "Use lots of emojis (e.g., ✨, 🌟, 💖)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text, no markdown.`,
        includeTitle: false,
        maxTokens: 512,
      },
      linkedin: {
        prompt: `Create a LinkedIn post about: ${prompt}. ${contentLength === "short" ? "1 paragraph" : contentLength === "medium" ? "1-2 paragraphs" : "2-3 paragraphs"}. ${includeEmojis ? "Use some emojis (e.g., 🚀, ✅, 💡)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text with **bold** for emphasis.`,
        includeTitle: false,
        maxTokens: contentLength === "short" ? 512 : contentLength === "medium" ? 1024 : 2048,
      },
      youtube: {
        prompt: `Create a YouTube description about: ${prompt}. ${contentLength === "short" ? "2-3 sentences" : contentLength === "medium" ? "4-6 sentences" : "1-2 paragraphs"} with a hook, details, and CTA. ${includeEmojis ? "Use some emojis (e.g., 🎥, ▶️, 👍)." : ""} ${includeHashtags ? "Include 5-7 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text with *bold* for emphasis.`,
        includeTitle: true,
        maxTokens: contentLength === "short" ? 512 : contentLength === "medium" ? 1024 : 2048,
      },
      blog: {
        prompt: `Create a blog post about: ${prompt}. Include an intro, ${contentLength === "short" ? "1-2 sections" : contentLength === "medium" ? "3-4 sections" : "5-6 sections"} with ## subheadings, and a conclusion. ${includeEmojis ? "Use some emojis (e.g., 🎉, 💡, ✅)." : ""} ${includeHashtags ? "Include 5-7 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use markdown (# for title, ## for sections, **bold**, _italic_).`,
        includeTitle: true,
        maxTokens: contentLength === "short" ? 1024 : contentLength === "medium" ? 2048 : 4096,
      },
      tiktok: {
        prompt: `Create a TikTok caption about: ${prompt}. ${contentLength === "short" ? "1-2 sentences" : contentLength === "medium" ? "2-3 sentences" : "3-4 sentences"}. ${includeEmojis ? "Use lots of emojis (e.g., 🎵, 🔥, 🤩)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text, no markdown.`,
        includeTitle: false,
        maxTokens: 512,
      },
      pinterest: {
        prompt: `Create a Pinterest description about: ${prompt}. ${contentLength === "short" ? "1-2 sentences" : contentLength === "medium" ? "2-3 sentences" : "3-4 sentences"}. ${includeEmojis ? "Use some emojis (e.g., 📌, ✨, 💡)." : ""} ${includeHashtags ? "Include 3-5 relevant hashtags." : ""} Tone: ${tone}. Audience: ${audience}. Use plain text, no markdown.`,
        includeTitle: true,
        maxTokens: 512,
      },
    };

    const config = platformConfig[platform];
    const needsTitle = config.includeTitle;
    const seoPrompt = includeHashtags 
      ? (platform === "blog" || platform === "youtube" 
          ? "Include 5-7 SEO tags in JSON: [\"tag1\", \"tag2\"]" 
          : "Include 3-5 hashtags in JSON: [\"#tag1\", \"#tag2\"]") 
      : "";
    const titlePrompt = needsTitle 
      ? "Return JSON: {\"title\": \"Title\", \"content\": \"Content\", \"seoTags\": [\"tag1\"]}" 
      : "Return JSON: {\"content\": \"Content\", \"seoTags\": [\"tag1\"]}";
    
    const fullPrompt = `${config.prompt} ${seoPrompt} ${titlePrompt}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "AI Content Generator",
      },
      body: JSON.stringify({
        model: "nvidia/llama-3.1-nemotron-70b-instruct:free", // or your preferred model
        messages: [
          {
            role: "system",
            content: `You are an expert content creator specializing in platform-specific content. 
            - Twitter: Thread with numbered tweets (e.g., "1/3: text"), plain text
            - Twitter Pro: Single post, no limit, plain text
            - Facebook/LinkedIn: Plain text with **bold**, conversational
            - Instagram/TikTok/Pinterest: Plain text, concise
            - YouTube: Plain text with *bold*, structured
            - Blog: Full markdown (#, ##, **bold**, _italic_)
            - Never ever include like here is the....
            Adjust length based on contentLength: short (brief), medium (moderate), long (detailed).
            Match the specified tone and audience. Return content in the exact JSON format requested.`,
          },
          { role: "user", content: fullPrompt },
        ],
        temperature: 0.7,
        max_tokens: config.maxTokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API error:", errorData);
      return NextResponse.json({ error: "Failed to generate content" }, { status: response.status });
    }

    const data = await response.json();
    let generatedText = data.choices[0]?.message?.content || JSON.stringify(data);
    let parsedContent: GenerationResponse;

    try {
      parsedContent = JSON.parse(generatedText);
      if (!parsedContent.seoTags) {
        parsedContent.seoTags = [];
      }
    } catch (e) {
      console.warn("Failed to parse JSON, attempting fallback:", e);
      const hashtagRegex = /#[a-zA-Z0-9]+/g;
      const tags = includeHashtags ? (generatedText.match(hashtagRegex) || []) : [];
      const titleMatch = generatedText.match(/"title":\s*"([^"]+)"/);
      const contentMatch = generatedText.match(/"content":\s*"([^"]+)"/);

      parsedContent = {
        content: contentMatch ? contentMatch[1] : generatedText,
        seoTags: tags,
        title: needsTitle && titleMatch ? titleMatch[1] : undefined,
      };
    }

    // Ensure content is always a string
    if (!parsedContent.content) {
      parsedContent.content = "Generated content unavailable";
    }
    if (!Array.isArray(parsedContent.seoTags)) {
      parsedContent.seoTags = [];
    }

    return NextResponse.json(parsedContent);
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}