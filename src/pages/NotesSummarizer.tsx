import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Home, Copy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const NotesSummarizer = () => {
  const [originalNotes, setOriginalNotes] = useState("");
  const [summary, setSummary] = useState("");
  const [bulletPoints, setBulletPoints] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const summarizeNotes = async () => {
    if (!originalNotes.trim()) {
      toast.error("Please enter some notes to summarize");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Mock AI summarization - replace with actual AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate summarization
      const sentences = originalNotes.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const keyPoints = sentences.slice(0, Math.min(sentences.length, 6)).map(s => s.trim());
      
      setBulletPoints(keyPoints);
      
      const summaryText = `This content covers ${keyPoints.length} key concepts. The main themes include the fundamental principles discussed in the source material, with emphasis on practical applications and theoretical foundations.`;
      setSummary(summaryText);
      
      toast.success("Notes summarized successfully!");
    } catch (error) {
      toast.error("Failed to summarize notes. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    const fullText = `Summary:\n${summary}\n\nKey Points:\n${bulletPoints.map(point => `• ${point}`).join('\n')}`;
    navigator.clipboard.writeText(text || fullText);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">StudyHub</span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-accent" />
              Notes Summarizer
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Condense long notes or textbook chapters into bullet points with AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Original Notes</CardTitle>
                <CardDescription>
                  Paste your notes, textbook chapter, or any long content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="original-notes">Your Notes</Label>
                  <Textarea
                    id="original-notes"
                    placeholder="Paste your notes, textbook content, or lecture materials here..."
                    value={originalNotes}
                    onChange={(e) => setOriginalNotes(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    {originalNotes.length} characters • {originalNotes.split(' ').length} words
                  </div>
                </div>

                <Button 
                  onClick={summarizeNotes} 
                  disabled={isProcessing || !originalNotes.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Summarize with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Summary & Key Points
                  {summary && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard("")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-generated summary with bullet points
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Summary</h3>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-sm">{summary}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Key Points</h3>
                      <div className="space-y-2">
                        {bulletPoints.map((point, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-secondary/30 rounded-lg">
                            <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px] text-center text-muted-foreground">
                    <div>
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your summary and key points will appear here</p>
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
                  <div className="text-2xl mb-2">📋</div>
                  <h3 className="font-semibold mb-1">Extract Key Points</h3>
                  <p className="text-sm text-muted-foreground">Identifies the most important information from your notes</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">⚡</div>
                  <h3 className="font-semibold mb-1">Quick Summary</h3>
                  <p className="text-sm text-muted-foreground">Creates concise summaries of long content</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <h3 className="font-semibold mb-1">Bullet Format</h3>
                  <p className="text-sm text-muted-foreground">Organizes information in easy-to-review bullet points</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotesSummarizer;