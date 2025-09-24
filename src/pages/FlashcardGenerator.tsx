import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Brain, Home, Shuffle, RotateCcw, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Flashcard {
  question: string;
  answer: string;
}

const FlashcardGenerator = () => {
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock API call - replace with actual AI API integration
  const generateFlashcards = async () => {
    if (!notes.trim()) {
      toast.error("Please enter some notes to generate flashcards");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock flashcard generation based on notes content
      const mockFlashcards: Flashcard[] = [
        {
          question: "What is the main topic discussed in these notes?",
          answer: "Based on your notes, the main focus appears to be on the key concepts and definitions you've provided."
        },
        {
          question: "What are the important terms mentioned?",
          answer: "The important terms include the key vocabulary and concepts highlighted in your study material."
        },
        {
          question: "How can you apply this knowledge?",
          answer: "This knowledge can be applied through practice problems, real-world examples, and connecting concepts together."
        }
      ];

      // Generate more realistic flashcards based on notes content
      const sentences = notes.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const generatedCards: Flashcard[] = [];

      sentences.slice(0, 8).forEach((sentence, index) => {
        const cleanSentence = sentence.trim();
        if (cleanSentence) {
          // Create question by removing key terms
          const words = cleanSentence.split(' ');
          if (words.length > 5) {
            const keyWordIndex = Math.floor(words.length / 2);
            const keyWord = words[keyWordIndex];
            const question = cleanSentence.replace(keyWord, '____');
            generatedCards.push({
              question: `Fill in the blank: ${question}`,
              answer: keyWord
            });
          }
        }
      });

      if (generatedCards.length === 0) {
        setFlashcards(mockFlashcards);
      } else {
        setFlashcards([...generatedCards, ...mockFlashcards].slice(0, 10));
      }
      
      setCurrentCardIndex(0);
      setShowAnswer(false);
      toast.success(`Generated ${flashcards.length} flashcards!`);
      
    } catch (error) {
      toast.error("Failed to generate flashcards. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    toast.success("Cards shuffled!");
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    toast.success("Session reset!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Intellia</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Brain className="h-10 w-10 text-accent" />
              AI Flashcard Generator
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your notes into interactive study cards with AI
            </p>
          </div>

          {flashcards.length === 0 ? (
            // Notes Input Section
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Notes</CardTitle>
                <CardDescription>
                  Paste your study notes, lecture content, or textbook excerpts. Our AI will create flashcards automatically.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your notes here... 

For example:
- Photosynthesis is the process by which plants convert sunlight into energy
- The mitochondria is known as the powerhouse of the cell
- DNA stands for Deoxyribonucleic acid"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[200px]"
                />
                <Button 
                  onClick={generateFlashcards} 
                  disabled={isGenerating || !notes.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="mr-2 h-5 w-5 animate-spin" />
                      Generating Flashcards...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Generate Flashcards
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            // Flashcards Study Section
            <div className="space-y-6">
              {/* Study Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm">
                    Card {currentCardIndex + 1} of {flashcards.length}
                  </Badge>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="outline" size="sm" onClick={shuffleCards}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Shuffle
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetSession}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setFlashcards([])}
                  className="text-muted-foreground"
                >
                  Generate New Cards
                </Button>
              </div>

              {/* Flashcard Display */}
              <Card className="min-h-[300px] cursor-pointer transition-all duration-300 hover:shadow-elegant">
                <CardContent 
                  className="p-8 flex flex-col justify-center items-center text-center h-full min-h-[300px]"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <div className="mb-4">
                    <Badge variant={showAnswer ? "default" : "secondary"}>
                      {showAnswer ? "Answer" : "Question"}
                    </Badge>
                  </div>
                  <div className="text-xl leading-relaxed">
                    {showAnswer 
                      ? flashcards[currentCardIndex]?.answer 
                      : flashcards[currentCardIndex]?.question
                    }
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    Click to {showAnswer ? "show question" : "reveal answer"}
                  </p>
                </CardContent>
              </Card>

              {/* Navigation Controls */}
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={prevCard}>
                  Previous
                </Button>
                <Button 
                  variant={showAnswer ? "default" : "secondary"}
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  {showAnswer ? "Show Question" : "Show Answer"}
                </Button>
                <Button variant="outline" onClick={nextCard}>
                  Next
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" className="text-success">
                  <Check className="h-4 w-4 mr-2" />
                  Know It
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <X className="h-4 w-4 mr-2" />
                  Study More
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
