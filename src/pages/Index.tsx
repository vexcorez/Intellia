import { Calculator, Brain, BookOpen, ArrowRight, Calendar, FileEdit, FileText, Quote, Timer, CheckSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  const tools = [
    {
      title: "GPA Calculator",
      description: "Calculate your GPA with numeric grades (40-100)",
      icon: Calculator,
      path: "/gpa-calculator",
      color: "text-primary",
    },
    {
      title: "AI Flashcards",
      description: "Turn your notes into study cards with AI",
      icon: Brain,
      path: "/flashcard-generator",
      color: "text-accent",
      aiPowered: true,
    },
    {
      title: "Study Planner",
      description: "Generate daily/weekly study schedules from your exams",
      icon: Calendar,
      path: "/study-planner",
      color: "text-primary",
    },
    {
      title: "Essay Rewriter",
      description: "Improve grammar, clarity, and style with AI",
      icon: FileEdit,
      path: "/essay-rewriter",
      color: "text-accent",
      aiPowered: true,
    },
    {
      title: "Notes Summarizer",
      description: "Condense long notes into bullet points with AI",
      icon: FileText,
      path: "/notes-summarizer",
      color: "text-accent",
      aiPowered: true,
    },
    {
      title: "Citation Generator",
      description: "Create MLA, APA, or Chicago-style references",
      icon: Quote,
      path: "/citation-generator",
      color: "text-primary",
    },
    {
      title: "Pomodoro Timer",
      description: "Focus timer with customizable study/break intervals",
      icon: Timer,
      path: "/pomodoro-timer",
      color: "text-primary",
    },
    {
      title: "Exam Tracker",
      description: "Track studied topics and visualize your progress",
      icon: CheckSquare,
      path: "/exam-tracker",
      color: "text-primary",
    },
    {
      title: "Math Problem Solver",
      description: "Solve equations step-by-step with AI explanations",
      icon: Calculator,
      path: "/math-solver",
      color: "text-accent",
      aiPowered: true,
    },
    {
      title: "Random Group Picker",
      description: "Randomly select students for groups or presentations",
      icon: Users,
      path: "/group-picker",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Intellia</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Essential Student Tools
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Free, instant access to the tools you need for academic success.
            No sign-up required.
          </p>
          <Button size="lg" variant="secondary" className="shadow-elegant">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Tool</h2>
            <p className="text-xl text-muted-foreground">
              Simple, powerful tools designed for student success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Link key={index} to={tool.path}>
                  <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full relative">
                    {tool.aiPowered && (
                      <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                        AI
                      </div>
                    )}
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                        <Icon className={`h-8 w-8 ${tool.color}`} />
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-sm mb-4">
                        {tool.description}
                      </CardDescription>
                      <Button size="sm" className="w-full group-hover:bg-primary-glow transition-colors">
                        Use Tool
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Why StudyHub?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
              <p className="text-muted-foreground">No sign-up required. Jump straight into using the tools you need.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Student-Focused</h3>
              <p className="text-muted-foreground">Built specifically for high school and college students' daily needs.</p>
            </div>
            <div className="p-6">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-muted-foreground">Leverage artificial intelligence to enhance your studying efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            Made for students, by Ali Abu Harrah. Free forever.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
