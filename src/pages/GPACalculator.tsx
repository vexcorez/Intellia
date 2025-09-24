import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Course {
  id: string;
  name: string;
  grade: string;
  credits: number;
}

const GPACalculator = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", name: "", grade: "", credits: 3 }
  ]);

  const gradePoints: { [key: string]: number } = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
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

  const calculateGPA = () => {
    const validCourses = courses.filter(course => course.grade && course.credits > 0);
    
    if (validCourses.length === 0) {
      toast.error("Please add at least one course with a grade and credits");
      return 0;
    }

    const totalPoints = validCourses.reduce((sum, course) => {
      return sum + (gradePoints[course.grade] * course.credits);
    }, 0);

    const totalCredits = validCourses.reduce((sum, course) => sum + course.credits, 0);
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const gpa = calculateGPA();
  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return "text-success";
    if (gpa >= 2.5) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">StudyHub</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">GPA Calculator</h1>
            <p className="text-xl text-muted-foreground">
              Calculate your Grade Point Average instantly
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
                        <Label htmlFor={`grade-${course.id}`}>Grade</Label>
                        <Select
                          value={course.grade}
                          onValueChange={(value) => updateCourse(course.id, "grade", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(gradePoints).map((grade) => (
                              <SelectItem key={grade} value={grade}>
                                {grade} ({gradePoints[grade]})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <span>{courses.filter(c => c.grade && c.credits > 0).reduce((sum, c) => sum + c.credits, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Courses:</span>
                      <span>{courses.filter(c => c.grade).length}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                    <h4 className="font-semibold mb-2">GPA Scale</h4>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-success">3.5 - 4.0</span>
                        <span>Excellent</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-warning">2.5 - 3.4</span>
                        <span>Good</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-destructive">0.0 - 2.4</span>
                        <span>Needs Improvement</span>
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