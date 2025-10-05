import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Save, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Course {
  id: string;
  name: string;
  grade: number | "";
  credits: number;
}

const GPACalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", grade: "", credits: 3 }
  ]);
  const [gpaHistory, setGpaHistory] = useState<any[]>([]);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    if (session?.user) {
      fetchGPAHistory(session.user.id);
    }
  };

  const fetchGPAHistory = async (userId: string) => {
    const { data } = await supabase
      .from("gpa_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (data) {
      setGpaHistory(data);
    }
  };

  const calculateGPA = () => {
    const validCourses = courses.filter(course => course.grade !== "" && course.credits > 0);
    
    if (validCourses.length === 0) {
      return 0;
    }

    const totalPoints = validCourses.reduce((sum, course) => {
      const numGrade = Number(course.grade);
      const gpaPoints = Math.max(0, (numGrade - 40) / 15);
      return sum + (gpaPoints * course.credits);
    }, 0);

    const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const saveGPA = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your GPA history",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    const gpa = calculateGPA();
    const validCourses = courses.filter(c => c.grade !== "" && c.credits > 0);
    const totalCredits = validCourses.reduce((sum, c) => sum + c.credits, 0);

    if (validCourses.length === 0) {
      toast({
        title: "No courses",
        description: "Please add at least one course with grades",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("gpa_history")
      .insert({
        user_id: user.id,
        gpa: Number(gpa.toFixed(2)),
        total_credits: totalCredits,
        courses: JSON.stringify(validCourses),
      });

    if (error) {
      toast({
        title: "Save failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "GPA saved!",
        description: "Your GPA has been saved to your history",
      });
      fetchGPAHistory(user.id);
    }
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: "",
      grade: "",
      credits: 3
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const resetCalculator = () => {
    setCourses([{ id: "1", name: "", grade: "", credits: 3 }]);
    toast({ title: "Calculator reset" });
  };

  const gpa = calculateGPA();
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-green-600";
    if (gpa >= 2.5) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeColor = (grade: number | "") => {
    if (grade === "") return "";
    const numGrade = Number(grade);
    if (numGrade >= 90) return "text-green-600";
    if (numGrade >= 80) return "text-yellow-600";
    if (numGrade < 60) return "text-red-600";
    return "";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">GPA Calculator</h1>
            <p className="text-xl text-muted-foreground">
              Calculate and save your GPA with numeric grades (40-100)
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>
                    Add your courses, grades, and credit hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-secondary/20 rounded-lg">
                      <div className="col-span-5">
                        <Label>Course Name</Label>
                        <Input
                          placeholder="e.g., Calculus I"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Grade (40-100)</Label>
                        <Input
                          type="number"
                          min="40"
                          max="100"
                          placeholder="85"
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, "grade", e.target.value ? parseInt(e.target.value) : "")}
                          className={getGradeColor(course.grade)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Credits</Label>
                        <Input
                          type="number"
                          min="0"
                          max="6"
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, "credits", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeCourse(course.id)}
                          disabled={courses.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <Button onClick={addCourse} variant="outline" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                    <Button onClick={resetCalculator} variant="outline">
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="text-center">
                  <CardTitle>Your GPA</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getGPAColor(gpa)}`}>
                    {gpa.toFixed(2)}
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Total Credits:</span>
                      <span>{courses.filter(c => c.grade !== "" && c.credits > 0).reduce((sum, c) => sum + c.credits, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Courses:</span>
                      <span>{courses.filter(c => c.grade !== "").length}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={saveGPA} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save GPA
                    </Button>
                    <Dialog open={historyDialogOpen} onOpenChange={setHistoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>GPA History</DialogTitle>
                          <DialogDescription>
                            Your saved GPA calculations
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                          {gpaHistory.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">
                              No saved GPAs yet
                            </p>
                          ) : (
                            gpaHistory.map((record) => (
                              <Card key={record.id} className="p-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="text-2xl font-bold">{record.gpa}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {record.total_credits} credits
                                    </div>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(record.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </Card>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Grade Scale</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>90-100</span>
                        <span>A (Excellent)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>80-89</span>
                        <span>B (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>70-79</span>
                        <span>C (Average)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>60-69</span>
                        <span>D (Below Avg)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>40-59</span>
                        <span>F (Fail)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GPACalculator;
