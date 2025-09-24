import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Home, Copy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const EssayRewriter = () => {
  const [originalText, setOriginalText] = useState("");
  const [rewrittenText, setRewrittenText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const rewriteEssay = async () => {
    if (!originalText.trim()) {
      toast.error("Please enter some text to rewrite");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Mock AI rewriting - replace with actual AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate improvements
      const improved = originalText
        .replace(/\bthat\b/g, "which")
        .replace(/\bvery\b/g, "extremely")
        .replace(/\bgood\b/g, "excellent")
        .replace(/\bbad\b/g, "inadequate")
        .replace(/\bthing\b/g, "aspect")
        .replace(/\bget\b/g, "obtain")
        .replace(/\bmake\b/g, "create")
        + "\n\n[AI Enhancement: Improved vocabulary, sentence structure, and clarity while maintaining your original ideas and voice.]";
      
      setRewrittenText(improved);
      toast.success("Essay rewritten successfully!");
    } catch (error) {
      toast.error("Failed to rewrite essay. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Intellia</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <FileEdit className="h-8 w-8 text-accent" />
              Essay Rewriter
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Improve grammar, clarity, and style with AI-powered rewriting
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Original Text</CardTitle>
                <CardDescription>
                  Paste your essay, paragraph, or any text you want to improve
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="original-text">Your Text</Label>
                  <Textarea
                    id="original-text"
                    placeholder="Paste your essay or paragraph here..."
                    value={originalText}
                    onChange={(e) => setOriginalText(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    {originalText.length} characters
                  </div>
                </div>

                <Button 
                  onClick={rewriteEssay} 
                  disabled={isProcessing || !originalText.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <FileEdit className="h-4 w-4 mr-2" />
                      Rewrite with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Improved Text
                  {rewrittenText && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(rewrittenText)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-enhanced version with improved grammar and clarity
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rewrittenText ? (
                  <div>
                    <Textarea
                      value={rewrittenText}
                      readOnly
                      className="min-h-[300px] resize-none bg-secondary/30"
                    />
                    <div className="text-xs text-muted-foreground mt-2">
                      {rewrittenText.length} characters
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px] text-center text-muted-foreground">
                    <div>
                      <FileEdit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your improved text will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What This Tool Does</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold mb-1">Grammar Check</h3>
                  <p className="text-sm text-muted-foreground">Fixes grammatical errors and improves sentence structure</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💡</div>
                  <h3 className="font-semibold mb-1">Clarity Enhancement</h3>
                  <p className="text-sm text-muted-foreground">Makes your ideas clearer and more concise</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <h3 className="font-semibold mb-1">Style Improvement</h3>
                  <p className="text-sm text-muted-foreground">Enhances vocabulary and writing style</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EssayRewriter;
