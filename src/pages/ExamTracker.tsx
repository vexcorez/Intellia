import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Plus, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudyTopic {
  id: string;
  name: string;
  completed: boolean;
  difficulty: "easy" | "medium" | "hard";
  timeSpent: number; // in minutes
}

interface Exam {
  id: string;
  name: string;
  date: string;
  topics: StudyTopic[];
}

const ExamTracker = () => {
  const { toast } = useToast();
  const [exams, setExams] = useState<Exam[]>([]);
  const [newExamName, setNewExamName] = useState("");
  const [newExamDate, setNewExamDate] = useState("");

  const addExam = () => {
    if (!newExamName || !newExamDate) {
      toast.error("Please enter exam name and date");
      return;
    }

    const newExam: Exam = {
      id: Date.now().toString(),
      name: newExamName,
      date: newExamDate,
      topics: []
    };

    setExams([...exams, newExam]);
    setNewExamName("");
    setNewExamDate("");
    toast.success("Exam added successfully!");
  };

  const removeExam = (examId: string) => {
    setExams(exams.filter(exam => exam.id !== examId));
    toast.success("Exam removed");
  };

  const addTopic = (examId: string) => {
    const topicName = prompt("Enter topic name:");
    if (!topicName) return;

    const newTopic: StudyTopic = {
      id: Date.now().toString(),
      name: topicName,
      completed: false,
      difficulty: "medium",
      timeSpent: 0
    };

    setExams(exams.map(exam => 
      exam.id === examId 
        ? { ...exam, topics: [...exam.topics, newTopic] }
        : exam
    ));
  };

  const toggleTopicComplete = (examId: string, topicId: string) => {
    setExams(exams.map(exam => 
      exam.id === examId 
        ? {
            ...exam, 
            topics: exam.topics.map(topic => 
              topic.id === topicId 
                ? { ...topic, completed: !topic.completed }
                : topic
            )
          }
        : exam
    ));
  };

  const removeTopic = (examId: string, topicId: string) => {
    setExams(exams.map(exam => 
      exam.id === examId 
        ? { ...exam, topics: exam.topics.filter(topic => topic.id !== topicId) }
        : exam
    ));
  };

  const updateTopicDifficulty = (examId: string, topicId: string, difficulty: "easy" | "medium" | "hard") => {
    setExams(exams.map(exam => 
      exam.id === examId 
        ? {
            ...exam, 
            topics: exam.topics.map(topic => 
              topic.id === topicId 
                ? { ...topic, difficulty }
                : topic
            )
          }
        : exam
    ));
  };

  const addStudyTime = (examId: string, topicId: string) => {
    const minutes = parseInt(prompt("Add study time (minutes):") || "0");
    if (minutes <= 0) return;

    setExams(exams.map(exam => 
      exam.id === examId 
        ? {
            ...exam, 
            topics: exam.topics.map(topic => 
              topic.id === topicId 
                ? { ...topic, timeSpent: topic.timeSpent + minutes }
                : topic
            )
          }
        : exam
    ));
  };

  const getExamProgress = (exam: Exam) => {
    if (exam.topics.length === 0) return 0;
    const completedTopics = exam.topics.filter(topic => topic.completed).length;
    return Math.round((completedTopics / exam.topics.length) * 100);
  };

  const getTotalStudyTime = (exam: Exam) => {
    return exam.topics.reduce((total, topic) => total + topic.timeSpent, 0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-success";
      case "medium": return "text-warning";
      case "hard": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getDaysUntilExam = (examDate: string) => {
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              <CheckSquare className="h-8 w-8 text-primary" />
              Exam Revision Tracker
            </h1>
            <p className="text-xl text-muted-foreground">
              Track studied topics and visualize your exam preparation progress
            </p>
          </div>

          {/* Add New Exam */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Exam</CardTitle>
              <CardDescription>
                Create a new exam to track your revision progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="exam-name">Exam Name</Label>
                  <Input
                    id="exam-name"
                    placeholder="Mathematics Final"
                    value={newExamName}
                    onChange={(e) => setNewExamName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="exam-date">Exam Date</Label>
                  <Input
                    id="exam-date"
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addExam} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exam
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exams List */}
          {exams.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No exams added yet</h3>
                <p className="text-muted-foreground">Add your first exam to start tracking your revision progress</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {exams.map((exam) => (
                <Card key={exam.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {exam.name}
                          <span className={`text-sm px-2 py-1 rounded-full ${
                            getDaysUntilExam(exam.date) <= 7 ? 'bg-destructive/20 text-destructive' :
                            getDaysUntilExam(exam.date) <= 14 ? 'bg-warning/20 text-warning' :
                            'bg-success/20 text-success'
                          }`}>
                            {getDaysUntilExam(exam.date)} days left
                          </span>
                        </CardTitle>
                        <CardDescription>
                          Exam Date: {new Date(exam.date).toLocaleDateString()} • 
                          Study Time: {Math.floor(getTotalStudyTime(exam) / 60)}h {getTotalStudyTime(exam) % 60}m
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeExam(exam.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{getExamProgress(exam)}% complete</span>
                      </div>
                      <Progress value={getExamProgress(exam)} className="h-2" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Topics */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Study Topics</h4>
                        <Button
                          size="sm"
                          onClick={() => addTopic(exam.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Topic
                        </Button>
                      </div>
                      
                      {exam.topics.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No topics added yet. Click "Add Topic" to get started.
                        </div>
                      ) : (
                        <div className="grid gap-2">
                          {exam.topics.map((topic) => (
                            <div
                              key={topic.id}
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                topic.completed ? 'bg-success/10 border-success/30' : 'bg-secondary/30'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Button
                                  variant={topic.completed ? "default" : "outline"}
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => toggleTopicComplete(exam.id, topic.id)}
                                >
                                  {topic.completed && <CheckSquare className="h-4 w-4" />}
                                </Button>
                                <div>
                                  <span className={`font-medium ${topic.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {topic.name}
                                  </span>
                                  <div className="flex items-center gap-2 text-xs">
                                    <select
                                      className={`border-none bg-transparent ${getDifficultyColor(topic.difficulty)}`}
                                      value={topic.difficulty}
                                      onChange={(e) => updateTopicDifficulty(exam.id, topic.id, e.target.value as any)}
                                    >
                                      <option value="easy">Easy</option>
                                      <option value="medium">Medium</option>
                                      <option value="hard">Hard</option>
                                    </select>
                                    {topic.timeSpent > 0 && (
                                      <span className="text-muted-foreground">
                                        {Math.floor(topic.timeSpent / 60)}h {topic.timeSpent % 60}m
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addStudyTime(exam.id, topic.id)}
                                >
                                  + Time
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => removeTopic(exam.id, topic.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamTracker;
