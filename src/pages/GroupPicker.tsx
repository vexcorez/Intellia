import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Users, Shuffle, Plus, Trash2, Home, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const GroupPicker = () => {
  const [students, setStudents] = useState<string[]>([]);
  const [newStudent, setNewStudent] = useState("");
  const [groupSize, setGroupSize] = useState(4);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [groups, setGroups] = useState<string[][]>([]);
  const [bulkInput, setBulkInput] = useState("");

  const addStudent = () => {
    if (!newStudent.trim()) {
      toast.error("Please enter a student name");
      return;
    }

    if (students.includes(newStudent.trim())) {
      toast.error("Student already exists");
      return;
    }

    setStudents([...students, newStudent.trim()]);
    setNewStudent("");
    toast.success("Student added!");
  };

  const removeStudent = (studentToRemove: string) => {
    setStudents(students.filter(student => student !== studentToRemove));
  };

  const addBulkStudents = () => {
    if (!bulkInput.trim()) return;

    const newStudents = bulkInput
      .split('\n')
      .map(name => name.trim())
      .filter(name => name.length > 0 && !students.includes(name));

    if (newStudents.length === 0) {
      toast.error("No new valid students to add");
      return;
    }

    setStudents([...students, ...newStudents]);
    setBulkInput("");
    toast.success(`Added ${newStudents.length} students!`);
  };

  const pickRandomStudent = () => {
    if (students.length === 0) {
      toast.error("No students available");
      return;
    }

    const randomIndex = Math.floor(Math.random() * students.length);
    setSelectedStudent(students[randomIndex]);
    toast.success(`Selected: ${students[randomIndex]}`);
  };

  const createRandomGroups = () => {
    if (students.length === 0) {
      toast.error("No students available");
      return;
    }

    if (groupSize < 1 || groupSize > students.length) {
      toast.error("Invalid group size");
      return;
    }

    // Shuffle students
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    
    // Create groups
    const newGroups: string[][] = [];
    for (let i = 0; i < shuffledStudents.length; i += groupSize) {
      newGroups.push(shuffledStudents.slice(i, i + groupSize));
    }

    setGroups(newGroups);
    toast.success(`Created ${newGroups.length} groups!`);
  };

  const clearAll = () => {
    setStudents([]);
    setGroups([]);
    setSelectedStudent("");
    setBulkInput("");
    toast.success("All data cleared");
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Random Group Picker
            </h1>
            <p className="text-xl text-muted-foreground">
              Randomly select students for groups, presentations, or question answering
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Add Students */}
              <Card>
                <CardHeader>
                  <CardTitle>Student List ({students.length})</CardTitle>
                  <CardDescription>
                    Add students individually or in bulk
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Individual Add */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter student name"
                      value={newStudent}
                      onChange={(e) => setNewStudent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addStudent()}
                    />
                    <Button onClick={addStudent}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Bulk Add */}
                  <div>
                    <Label htmlFor="bulk-input">Add Multiple Students</Label>
                    <Textarea
                      id="bulk-input"
                      placeholder="Enter student names, one per line:
Alice Johnson
Bob Smith
Carol Davis"
                      value={bulkInput}
                      onChange={(e) => setBulkInput(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <Button 
                      onClick={addBulkStudents} 
                      className="w-full mt-2"
                      disabled={!bulkInput.trim()}
                    >
                      Add Students from List
                    </Button>
                  </div>

                  {/* Student List */}
                  <div className="max-h-48 overflow-y-auto border rounded-lg p-2">
                    {students.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">No students added yet</p>
                    ) : (
                      <div className="space-y-1">
                        {students.map((student, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded">
                            <span className="text-sm">{student}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 text-destructive hover:text-destructive"
                              onClick={() => removeStudent(student)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={clearAll} 
                    variant="outline" 
                    className="w-full"
                    disabled={students.length === 0}
                  >
                    Clear All Students
                  </Button>
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="group-size">Group Size</Label>
                    <Input
                      id="group-size"
                      type="number"
                      min="1"
                      max={Math.max(1, students.length)}
                      value={groupSize}
                      onChange={(e) => setGroupSize(parseInt(e.target.value) || 1)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {students.length > 0 && `Will create ${Math.ceil(students.length / groupSize)} groups`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Random Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Random Student Picker</CardTitle>
                  <CardDescription>
                    Pick one student randomly for questions or presentations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={pickRandomStudent} 
                    className="w-full"
                    disabled={students.length === 0}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Pick Random Student
                  </Button>

                  {selectedStudent && (
                    <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center">
                      <h3 className="font-semibold text-primary mb-2">Selected Student</h3>
                      <p className="text-2xl font-bold">{selectedStudent}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Group Generator */}
              <Card>
                <CardHeader>
                  <CardTitle>Random Groups</CardTitle>
                  <CardDescription>
                    Create random groups for activities and projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={createRandomGroups} 
                    className="w-full"
                    disabled={students.length === 0}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Create Random Groups
                  </Button>

                  {groups.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold">Generated Groups:</h3>
                      {groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="p-3 bg-secondary/30 rounded-lg">
                          <h4 className="font-semibold mb-2 text-sm text-primary">
                            Group {groupIndex + 1} ({group.length} members)
                          </h4>
                          <div className="space-y-1">
                            {group.map((student, studentIndex) => (
                              <div key={studentIndex} className="text-sm p-2 bg-background rounded">
                                {student}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Features */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">👥</div>
                  <h3 className="font-semibold mb-1">Add Students</h3>
                  <p className="text-sm text-muted-foreground">Enter student names individually or paste a list</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h3 className="font-semibold mb-1">Random Selection</h3>
                  <p className="text-sm text-muted-foreground">Pick individual students for questions or activities</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔀</div>
                  <h3 className="font-semibold mb-1">Group Creation</h3>
                  <p className="text-sm text-muted-foreground">Generate random groups of any size for projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupPicker;