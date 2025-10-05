import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Brain, Shuffle, RotateCcw, Check, X, Save, Plus, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Flashcard {
  question: string;
  answer: string;
}

const FlashcardGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSets, setSavedSets] = useState<any[]>([]);
  const [setTitle, setSetTitle] = useState("");
  const [setDescription, setSetDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      fetchSavedSets(session.user.id);
    }
  };

  const fetchSavedSets = async (userId: string) => {
    const { data } = await supabase
      .from("flashcard_sets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (data) {
      setSavedSets(data);
    }
  };

  const generateFlashcards = async () => {
    if (!notes.trim()) {
      toast({
        title: "Notes required",
        description: "Please enter some notes to generate flashcards",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const sentences = notes.split(/[.!?]+/).filter(s => s.trim().length > 10);
      const generatedCards: Flashcard[] = [];

      sentences.slice(0, 8).forEach((sentence) => {
        const cleanSentence = sentence.trim();
        if (cleanSentence) {
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
        generatedCards.push({
          question: "What is the main topic in your notes?",
          answer: "Based on your notes, focus on the key concepts discussed."
        });
      }

      setFlashcards(generatedCards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      toast({
        title: "Success!",
        description: `Generated ${generatedCards.length} flashcards`,
      });
      
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const saveFlashcardSet = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save flashcards",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!setTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your flashcard set",
        variant: "destructive",
      });
      return;
    }

    const { data: setData, error: setError } = await supabase
      .from("flashcard_sets")
      .insert({
        user_id: user.id,
        title: setTitle.trim(),
        description: setDescription.trim(),
        is_public: isPublic,
      })
      .select()
      .single();

    if (setError || !setData) {
      toast({
        title: "Save failed",
        description: setError?.message || "Failed to save flashcard set",
        variant: "destructive",
      });
      return;
    }

    const flashcardsToInsert = flashcards.map(card => ({
      set_id: setData.id,
      front: card.question,
      back: card.answer,
    }));

    const { error: cardsError } = await supabase
      .from("flashcards")
      .insert(flashcardsToInsert);

    if (cardsError) {
      toast({
        title: "Save failed",
        description: cardsError.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Saved!",
      description: "Your flashcard set has been saved",
    });
    setSaveDialogOpen(false);
    setSetTitle("");
    setSetDescription("");
    setIsPublic(false);
    fetchSavedSets(user.id);
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
    toast({ title: "Cards shuffled!" });
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    toast({ title: "Session reset!" });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Brain className="h-10 w-10 text-accent" />
              AI Flashcard Generator
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your notes into interactive study cards
            </p>
          </div>

          {flashcards.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Notes</CardTitle>
                <CardDescription>
                  Paste your study notes and we'll create flashcards automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your notes here..."
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
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Generate Flashcards
                    </>
                  )}
                </Button>

                {savedSets.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Your Saved Sets</h3>
                    <div className="space-y-2">
                      {savedSets.map((set) => (
                        <Card key={set.id} className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{set.title}</h4>
                              {set.description && <p className="text-sm text-muted-foreground">{set.description}</p>}
                            </div>
                            {set.is_public && <Badge variant="secondary">Public</Badge>}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
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
                <div className="flex gap-2">
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" />
                        Save Set
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Flashcard Set</DialogTitle>
                        <DialogDescription>
                          Save your flashcards to access them later
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={setTitle}
                            onChange={(e) => setSetTitle(e.target.value)}
                            placeholder="e.g., Biology Chapter 3"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description (optional)</Label>
                          <Textarea
                            id="description"
                            value={setDescription}
                            onChange={(e) => setSetDescription(e.target.value)}
                            placeholder="Add a description..."
                            rows={3}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="public">Make public</Label>
                          <Switch
                            id="public"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                          />
                        </div>
                        <Button onClick={saveFlashcardSet} className="w-full">
                          Save Flashcards
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" onClick={() => setFlashcards([])}>
                    New Set
                  </Button>
                </div>
              </div>

              <Card className="min-h-[300px] cursor-pointer transition-all hover:shadow-lg">
                <CardContent 
                  className="p-8 flex flex-col justify-center items-center text-center min-h-[300px]"
                  onClick={() => setShowAnswer(!showAnswer)}
                >
                  <Badge variant={showAnswer ? "default" : "secondary"} className="mb-4">
                    {showAnswer ? "Answer" : "Question"}
                  </Badge>
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

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={prevCard}>Previous</Button>
                <Button onClick={() => setShowAnswer(!showAnswer)}>
                  {showAnswer ? "Show Question" : "Show Answer"}
                </Button>
                <Button variant="outline" onClick={nextCard}>Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FlashcardGenerator;
