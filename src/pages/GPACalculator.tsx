import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
  grade: number | "";
  credits: number;
}

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", grade: "", credits: 3 }
  ]);

  const calculateGPA = () => {
    const validCourses = courses.filter(course => course.grade !== "" && course.credits > 0);
    
    if (validCourses.length === 0) {
      toast.error("Please add at least one course with a grade and credits");
      return 0;
    }

    const totalPoints = validCourses.reduce((sum, course) => {
      const numGrade = Number(course.grade);
      const gpaPoints = Math.max(0, (numGrade - 40) / 15); // Convert 40-100 scale to 0-4 GPA
      return sum + (gpaPoints * course.credits);
    }, 0);

    const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
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

  const gpa = calculateGPA();
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-success";
    if (gpa >= 2.5) return "text-warning";
    return "text-destructive";
  };

  const getGradeColor = (grade: number | "") => {
    if (grade === "") return "";
    const numGrade = Number(grade);
    if (numGrade >= 90) return "text-success";
    if (numGrade >= 80) return "text-warning";
    if (numGrade < 60) return "text-destructive";
    return "";
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
            <h1 className="text-4xl font-bold mb-4">GPA Calculator</h1>
            <p className="text-xl text-muted-foreground">
              Calculate your Grade Point Average with numeric grades (40-100 scale)
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Input */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>
                    Add your courses, grades, and credit hours
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courses.map((course, index) => (
                    <div key={course.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-secondary/30 rounded-lg">
                      <div className="col-span-5">
                        <Label htmlFor={`course-${course.id}`}>Course Name</Label>
                        <Input
                          id={`course-${course.id}`}
                          placeholder="e.g., Calculus I"
                          value={course.name}
                          onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor={`grade-${course.id}`}>Numeric Grade (40-100)</Label>
                        <Input
                          id={`grade-${course.id}`}
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
                        <Label htmlFor={`credits-${course.id}`}>Credits</Label>
                        <Input
                          id={`credits-${course.id}`}
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
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={addCourse} variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* GPA Display */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="text-center">
                  <CardTitle>Your GPA</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className={`text-6xl font-bold mb-4 ${getGPAColor(gpa)}`}>
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
                  
                  <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Grade Scale</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-success">90-100</span>
                        <span>A (Excellent)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-warning">80-89</span>
                        <span>B (Good)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>70-79</span>
                        <span>C (Average)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>60-69</span>
                        <span>D (Below Average)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-destructive">40-59</span>
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
    </div>
  );
};

export default GPACalculator;
