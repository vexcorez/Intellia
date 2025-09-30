import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Home, Copy, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface SolutionStep {
  step: string;
  explanation: string;
}

interface Solution {
  answer: string;
  steps: SolutionStep[];
}

const MathSolver = () => {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Show alert once on component mount
  useEffect(() => {
    toast.error("The math AI is pretty buggy and not fully developed.");
  }, []);

  const solveProblem = async () => {
    if (!problem.trim()) {
      toast.error("Please enter a math problem to solve");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Mock AI solving - replace with actual AI API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simple mock solution for demonstration
      let mockSolution: Solution;
      
      if (problem.toLowerCase().includes("quadratic") || problem.includes("x²") || problem.includes("x^2")) {
        mockSolution = {
          answer: "x = 3, x = -2",
          steps: [
            { step: "x² - x - 6 = 0", explanation: "Given quadratic equation" },
            { step: "(x - 3)(x + 2) = 0", explanation: "Factor the quadratic expression" },
            { step: "x - 3 = 0  or  x + 2 = 0", explanation: "Apply zero product property" },
            { step: "x = 3  or  x = -2", explanation: "Solve each linear equation" }
          ]
        };
      } else if (problem.includes("derivative") || problem.includes("d/dx")) {
        mockSolution = {
          answer: "f'(x) = 3x² + 2x",
          steps: [
            { step: "f(x) = x³ + x² + C", explanation: "Given function" },
            { step: "d/dx[x³] = 3x²", explanation: "Apply power rule to first term" },
            { step: "d/dx[x²] = 2x", explanation: "Apply power rule to second term" },
            { step: "f'(x) = 3x² + 2x", explanation: "Combine derivatives" }
          ]
        };
      } else {
        mockSolution = {
          answer: "x = 5",
          steps: [
            { step: "2x + 3 = 13", explanation: "Given linear equation" },
            { step: "2x = 13 - 3", explanation: "Subtract 3 from both sides" },
            { step: "2x = 10", explanation: "Simplify right side" },
            { step: "x = 5", explanation: "Divide both sides by 2" }
          ]
        };
      }
      
      setSolution(mockSolution);
      toast.success("Problem solved successfully!");
    } catch (error) {
      toast.error("Failed to solve problem. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!solution) return;
    
    const fullSolution = `Problem: ${problem}\n\nAnswer: ${solution.answer}\n\nStep-by-step solution:\n${
      solution.steps.map((step, index) => 
        `${index + 1}. ${step.step}\n   ${step.explanation}`
      ).join('\n')
    }`;
    
    navigator.clipboard.writeText(fullSolution);
    toast.success("Solution copied to clipboard!");
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
              <Calculator className="h-8 w-8 text-accent" />
              Math Problem Solver
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">AI</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Solve equations and problems step-by-step with AI explanations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle>Math Problem</CardTitle>
                <CardDescription>
                  Enter your math problem, equation, or question
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="math-problem">Problem</Label>
                  <Textarea
                    id="math-problem"
                    placeholder="Enter your math problem here...

Examples:
- Solve: 2x + 5 = 15
- Find derivative of x³ + 2x² - 5x + 1
- Solve quadratic: x² - 4x + 3 = 0
- Calculate integral of 2x + 3
- Find the area of a circle with radius 5"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    {problem.length} characters
                  </div>
                </div>

                <Button 
                  onClick={solveProblem} 
                  disabled={isProcessing || !problem.trim()}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Solving...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Solve with AI
                    </>
                  )}
                </Button>

                {/* Common Problem Types */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Quick Examples:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProblem("Solve: 3x - 7 = 14")}
                    >
                      Linear Equation
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProblem("Solve: x² - 5x + 6 = 0")}
                    >
                      Quadratic
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProblem("Find derivative of 2x³ + 4x - 1")}
                    >
                      Derivative
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProblem("Calculate: sin(π/4)")}
                    >
                      Trigonometry
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Step-by-Step Solution
                  {solution && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  )}
                </CardTitle>
                <CardDescription>
                  AI-generated solution with detailed explanations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {solution ? (
                  <div className="space-y-6">
                    {/* Final Answer */}
                    <div className="p-4 bg-success/10 border border-success/30 rounded-lg">
                      <h3 className="font-semibold text-success mb-2">Answer</h3>
                      <p className="text-lg font-mono">{solution.answer}</p>
                    </div>
                    
                    {/* Step-by-step solution */}
                    <div>
                      <h3 className="font-semibold mb-3">Step-by-step Solution</h3>
                      <div className="space-y-3">
                        {solution.steps.map((step, index) => (
                          <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-mono text-sm mb-1">{step.step}</p>
                                <p className="text-sm text-muted-foreground">{step.explanation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px] text-center text-muted-foreground">
                    <div>
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Your step-by-step solution will appear here</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Supported Problem Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📐</div>
                  <h3 className="font-semibold mb-1">Algebra</h3>
                  <p className="text-sm text-muted-foreground">Linear & quadratic equations, polynomials</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold mb-1">Calculus</h3>
                  <p className="text-sm text-muted-foreground">Derivatives, integrals, limits</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📏</div>
                  <h3 className="font-semibold mb-1">Geometry</h3>
                  <p className="text-sm text-muted-foreground">Areas, volumes, angles</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🌊</div>
                  <h3 className="font-semibold mb-1">Trigonometry</h3>
                  <p className="text-sm text-muted-foreground">Sin, cos, tan functions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MathSolver;
