import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import GPACalculator from "./pages/GPACalculator";
import FlashcardGenerator from "./pages/FlashcardGenerator";
import StudyPlanner from "./pages/StudyPlanner";
import EssayRewriter from "./pages/EssayRewriter";
import NotesSummarizer from "./pages/NotesSummarizer";
import CitationGenerator from "./pages/CitationGenerator";
import PomodoroTimer from "./pages/PomodoroTimer";
import ExamTracker from "./pages/ExamTracker";
import MathSolver from "./pages/MathSolver";
import GroupPicker from "./pages/GroupPicker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/gpa-calculator" element={<GPACalculator />} />
          <Route path="/flashcard-generator" element={<FlashcardGenerator />} />
          <Route path="/study-planner" element={<StudyPlanner />} />
          <Route path="/essay-rewriter" element={<EssayRewriter />} />
          <Route path="/notes-summarizer" element={<NotesSummarizer />} />
          <Route path="/citation-generator" element={<CitationGenerator />} />
          <Route path="/pomodoro-timer" element={<PomodoroTimer />} />
          <Route path="/exam-tracker" element={<ExamTracker />} />
          <Route path="/math-solver" element={<MathSolver />} />
          <Route path="/group-picker" element={<GroupPicker />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
