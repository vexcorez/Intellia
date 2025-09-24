import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Play, Pause, RotateCcw, Home, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PomodoroTimer = () => {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((time) => time - 1);
      }, 1000);
    } else if (currentTime === 0) {
      handleTimerComplete();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, currentTime]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (!isBreak) {
      setCompletedSessions(prev => prev + 1);
      setIsBreak(true);
      setCurrentTime(breakDuration * 60);
      toast.success("Work session completed! Time for a break.");
    } else {
      setIsBreak(false);
      setCurrentTime(workDuration * 60);
      toast.success("Break completed! Ready for another work session.");
    }

    // Play notification sound (you can replace this with an actual audio file)
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBDuO0vLNgC0FJHzE7t2QQgkVYrPq7KVYFQpBm+DyvmMfBD2N0/LUhS4FKX7C7dOQQwkUYrHq7qZYFgo/muDyv2kgBT2J0fLPhC0FKnzE7tOORQkVYLTq7KVXFQlKNn7VB...');
    audio.play().catch(() => {}); // Ignore errors if audio can't play
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setCurrentTime(workDuration * 60);
  };

  const updateWorkDuration = (minutes: number) => {
    setWorkDuration(minutes);
    if (!isBreak && !isActive) {
      setCurrentTime(minutes * 60);
    }
  };

  const updateBreakDuration = (minutes: number) => {
    setBreakDuration(minutes);
    if (isBreak && !isActive) {
      setCurrentTime(minutes * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalTime = isBreak ? breakDuration * 60 : workDuration * 60;
    return ((totalTime - currentTime) / totalTime) * 100;
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
              <Timer className="h-8 w-8 text-primary" />
              Pomodoro Timer
            </h1>
            <p className="text-xl text-muted-foreground">
              Focus timer with customizable study/break intervals
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Timer Display */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    {/* Current Session Type */}
                    <div>
                      <h2 className={`text-2xl font-semibold ${isBreak ? 'text-accent' : 'text-primary'}`}>
                        {isBreak ? 'Break Time' : 'Focus Time'}
                      </h2>
                      <div className="w-full bg-secondary/30 rounded-full h-2 mt-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${isBreak ? 'bg-accent' : 'bg-primary'}`}
                          style={{ width: `${getProgressPercentage()}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Timer Display */}
                    <div className="relative">
                      <div className={`text-8xl font-mono font-bold ${isBreak ? 'text-accent' : 'text-primary'}`}>
                        {formatTime(currentTime)}
                      </div>
                      <div className="text-lg text-muted-foreground mt-2">
                        {isBreak ? `${breakDuration} min break` : `${workDuration} min focus`}
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center gap-4">
                      {!isActive ? (
                        <Button onClick={startTimer} size="lg" className="px-8">
                          <Play className="h-5 w-5 mr-2" />
                          Start
                        </Button>
                      ) : (
                        <Button onClick={pauseTimer} size="lg" variant="secondary" className="px-8">
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                      )}
                      <Button onClick={resetTimer} size="lg" variant="outline" className="px-8">
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Reset
                      </Button>
                    </div>

                    {/* Session Counter */}
                    <div className="text-center pt-4 border-t">
                      <div className="text-2xl font-bold text-primary">{completedSessions}</div>
                      <div className="text-sm text-muted-foreground">Completed Sessions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your timer intervals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="work-duration">Focus Duration (minutes)</Label>
                    <Input
                      id="work-duration"
                      type="number"
                      min="1"
                      max="60"
                      value={workDuration}
                      onChange={(e) => updateWorkDuration(parseInt(e.target.value) || 25)}
                      disabled={isActive}
                    />
                  </div>

                  <div>
                    <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                    <Input
                      id="break-duration"
                      type="number"
                      min="1"
                      max="30"
                      value={breakDuration}
                      onChange={(e) => updateBreakDuration(parseInt(e.target.value) || 5)}
                      disabled={isActive}
                    />
                  </div>

                  <div className="pt-4 space-y-2 text-sm text-muted-foreground">
                    <h4 className="font-semibold text-foreground">Quick Presets:</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateWorkDuration(25);
                        updateBreakDuration(5);
                      }}
                      disabled={isActive}
                      className="w-full text-left justify-start"
                    >
                      Classic (25/5)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateWorkDuration(45);
                        updateBreakDuration(15);
                      }}
                      disabled={isActive}
                      className="w-full text-left justify-start"
                    >
                      Extended (45/15)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateWorkDuration(15);
                        updateBreakDuration(3);
                      }}
                      disabled={isActive}
                      className="w-full text-left justify-start"
                    >
                      Quick (15/3)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Pomodoro Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>• Focus completely during work sessions</p>
                  <p>• Take short breaks to recharge</p>
                  <p>• After 4 sessions, take a longer break</p>
                  <p>• Eliminate distractions before starting</p>
                  <p>• Use breaks to stretch or hydrate</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
