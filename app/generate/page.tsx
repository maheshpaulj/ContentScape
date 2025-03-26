// app/page.tsx
import { AIContentGenerator } from "./_components/generator";

export default function Home() {
  return (
    <div className="container mx-auto py-8 mt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-4xl underline font-bold tracking-tight">AI Content Generator</h1>
          <p className="text-muted-foreground">
            Generate optimized content for multiple platforms with a single prompt
          </p>
        </div>
        <AIContentGenerator />
      </div>
    </div>
  );
}