import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Trash2, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface ExamAssignment {
  id: string;
  name: string;
  date: string;
  priority: "high" | "medium" | "low";
}

const StudyPlanner = () => {
  const [items, setItems] = useState<ExamAssignment[]>([]);
  const [studyPlan, setStudyPlan] = useState<string[]>([]);

  const addItem = () => {
    const newItem: ExamAssignment = {
      id: Date.now().toString(),
      name: "",
      date: "",
      priority: "medium"
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof ExamAssignment, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const generatePlan = () => {
    if (items.length === 0) {
      toast.error("Please add at least one exam or assignment");
      return;
    }

    const validItems = items.filter(item => item.name && item.date);
    if (validItems.length === 0) {
      toast.error("Please complete all fields for your items");
      return;
    }

    // Sort by date and priority
    const sortedItems = validItems.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    const plan = [];
    const today = new Date();
    
    sortedItems.forEach(item => {
      const examDate = new Date(item.date);
      const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil > 0) {
        const studyDays = Math.max(1, Math.min(daysUntil - 1, item.priority === "high" ? 10 : item.priority === "medium" ? 7 : 5));
        plan.push(`${item.name} (${item.priority} priority) - Start studying ${studyDays} days before (${daysUntil} days remaining)`);
      }
    });

    setStudyPlan(plan);
    toast.success("Study plan generated!");
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Study Planner</h1>
            <p className="text-xl text-muted-foreground">
              Generate daily/weekly study schedules from your exams and assignments
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Exams & Assignments
                </CardTitle>
                <CardDescription>
                  Add your upcoming exams and assignments with dates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 bg-secondary/30 rounded-lg">
                    <div className="col-span-4">
                      <Label>Name</Label>
                      <Input
                        placeholder="Math Exam"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={item.date}
                        onChange={(e) => updateItem(item.id, "date", e.target.value)}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Priority</Label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={item.priority}
                        onChange={(e) => updateItem(item.id, "priority", e.target.value as any)}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button onClick={addItem} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>

                <Button onClick={generatePlan} className="w-full">
                  Generate Study Plan
                </Button>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Study Plan</CardTitle>
                <CardDescription>
                  Personalized schedule based on your deadlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                {studyPlan.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Add your exams and assignments to generate a study plan
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studyPlan.map((task, index) => (
                      <div key={index} className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-sm">{task}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;