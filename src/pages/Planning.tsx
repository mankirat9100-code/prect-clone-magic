import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RotateCcw, Save, MessageSquare } from "lucide-react";
import { PlanningTable, PlanningTask } from "@/components/planning/PlanningTable";
import { GanttChart } from "@/components/planning/GanttChart";
import { PlanningAISidebar } from "@/components/planning/PlanningAISidebar";
import { useToast } from "@/hooks/use-toast";

const INITIAL_TASKS: PlanningTask[] = [
  // Concept & Design
  {
    id: "1",
    stage: "Concept & Design",
    task: "Site Survey (Feature & Levels)",
    status: "Required",
    notes: "Provides contour levels and property boundaries",
    completed: false,
  },
  {
    id: "2",
    stage: "Concept & Design",
    task: "Geotechnical Investigation",
    status: "Complete",
    notes: "Soil classification and bearing capacity (AS 2870)",
    completed: true,
  },
  {
    id: "3",
    stage: "Concept & Design",
    task: "Bushfire Assessment (BAL)",
    status: "Not Required",
    notes: "Only needed for bushfire-prone sites",
    completed: false,
  },
  {
    id: "4",
    stage: "Concept & Design",
    task: "On-Site Wastewater Assessment",
    status: "Not Required",
    notes: "Only required for rural or unsewered lots",
    completed: false,
  },
  {
    id: "5",
    stage: "Concept & Design",
    task: "Architectural / Building Design",
    status: "Required",
    notes: "Floor plans, elevations, and layouts for approvals",
    completed: false,
  },
  {
    id: "6",
    stage: "Concept & Design",
    task: "Structural Engineering",
    status: "Pending",
    notes: "Slab, footings, beams, retaining walls design",
    completed: false,
  },
  {
    id: "7",
    stage: "Concept & Design",
    task: "NatHERS / BASIX Energy Report",
    status: "Required",
    notes: "Thermal and energy compliance for NSW dwellings",
    completed: false,
  },
  {
    id: "8",
    stage: "Concept & Design",
    task: "Statement of Environmental Effects (SEE)",
    status: "Required",
    notes: "Mandatory for Development Applications",
    completed: false,
  },
  // DA and CC Application
  {
    id: "9",
    stage: "DA and CC Application",
    task: "Development Application (DA) or CDC",
    status: "Pending",
    notes: "Obtain development consent or complying approval",
    completed: false,
  },
  {
    id: "10",
    stage: "DA and CC Application",
    task: "Construction certificate fees",
    status: "Pending",
    notes: "Fees for construction certificate application",
    completed: false,
  },
  {
    id: "11",
    stage: "DA and CC Application",
    task: "Construction Certificate (CC)",
    status: "Pending",
    notes: "Certifier or council approval to begin construction",
    completed: false,
  },
  // Tender / Builder Engagement
  {
    id: "12",
    stage: "Tender / Builder Engagement",
    task: "Prepare Final Construction Plans",
    status: "Required",
    notes: "Finalised and approved plans for builder pricing",
    completed: false,
  },
  {
    id: "13",
    stage: "Tender / Builder Engagement",
    task: "Obtain Builder Quotes",
    status: "Required",
    notes: "Seek tenders from licensed builders",
    completed: false,
  },
  {
    id: "14",
    stage: "Tender / Builder Engagement",
    task: "Select Builder / Sign Contract",
    status: "Required",
    notes: "Confirm builder licence and sign contract",
    completed: false,
  },
  // Construction
  {
    id: "15",
    stage: "Construction",
    task: "Arrange Builder's Insurance",
    status: "Required",
    notes: "Home warranty insurance for work over $20,000",
    completed: false,
  },
  {
    id: "16",
    stage: "Construction",
    task: "Lodge Notice of Commencement",
    status: "Required",
    notes: "Submit to council within 2 days of starting",
    completed: false,
  },
  {
    id: "17",
    stage: "Construction",
    task: "Stage Inspections",
    status: "Required",
    notes: "PCA inspections at key stages",
    completed: false,
  },
  {
    id: "18",
    stage: "Construction",
    task: "Final Inspection & Occupation Certificate",
    status: "Required",
    notes: "OC allows lawful occupation",
    completed: false,
  },
];

// Mock users - in a real app, this would come from your auth/database
const MOCK_USERS = [
  { id: "user1", name: "John Smith" },
  { id: "user2", name: "Sarah Johnson" },
  { id: "user3", name: "Mike Davis" },
  { id: "user4", name: "Emily Wilson" },
];

const Planning = () => {
  const [tasks, setTasks] = useState<PlanningTask[]>(INITIAL_TASKS);
  const [savedTasks, setSavedTasks] = useState<PlanningTask[]>(INITIAL_TASKS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  const handleTaskUpdate = (
    id: string,
    field: keyof PlanningTask,
    value: string | boolean | Date | undefined
  ) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, [field]: value } : task))
    );
  };

  const handleAddTask = (afterId: string) => {
    const index = tasks.findIndex((task) => task.id === afterId);
    const taskBefore = tasks[index];

    const newTask: PlanningTask = {
      id: `new-${Date.now()}`,
      stage: taskBefore.stage,
      task: "New Task",
      status: "Required",
      notes: "",
      completed: false,
    };

    setTasks((prev) => [
      ...prev.slice(0, index + 1),
      newTask,
      ...prev.slice(index + 1),
    ]);
  };

  const handleAddSubTask = (parentId: string) => {
    const parentTask = tasks.find((task) => task.id === parentId);
    if (!parentTask) return;

    const newSubTask: PlanningTask = {
      id: `sub-${Date.now()}`,
      stage: parentTask.stage,
      task: "New Sub-task",
      status: "Required",
      notes: "",
      completed: false,
      parentId: parentId,
    };

    // Find where to insert the sub-task (after the parent and any existing sub-tasks)
    const parentIndex = tasks.findIndex((task) => task.id === parentId);
    let insertIndex = parentIndex + 1;
    
    // Skip past any existing sub-tasks of this parent
    while (insertIndex < tasks.length && tasks[insertIndex].parentId === parentId) {
      insertIndex++;
    }

    setTasks((prev) => [
      ...prev.slice(0, insertIndex),
      newSubTask,
      ...prev.slice(insertIndex),
    ]);
  };

  const handleDeleteTask = (id: string) => {
    // Also delete any sub-tasks of this task
    setTasks((prev) => prev.filter((task) => task.id !== id && task.parentId !== id));
  };

  const handleMoveTaskUp = (id: string) => {
    setTasks((prev) => {
      const index = prev.findIndex((task) => task.id === id);
      if (index <= 0) return prev; // Already at the top
      
      const task = prev[index];
      const targetIndex = index - 1;
      const targetTask = prev[targetIndex];
      
      // Only allow moving within the same stage and same parent level
      if (task.stage !== targetTask.stage || task.parentId !== targetTask.parentId) {
        return prev;
      }
      
      const newTasks = [...prev];
      [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
      return newTasks;
    });
  };

  const handleMoveTaskDown = (id: string) => {
    setTasks((prev) => {
      const index = prev.findIndex((task) => task.id === id);
      if (index < 0 || index >= prev.length - 1) return prev; // Already at the bottom
      
      const task = prev[index];
      const targetIndex = index + 1;
      const targetTask = prev[targetIndex];
      
      // Only allow moving within the same stage and same parent level
      if (task.stage !== targetTask.stage || task.parentId !== targetTask.parentId) {
        return prev;
      }
      
      const newTasks = [...prev];
      [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
      return newTasks;
    });
  };

  const handleSave = () => {
    setSavedTasks(tasks);
    toast({
      title: "Progress saved",
      description: "Your planning checklist has been saved.",
    });
  };

  const handleReset = () => {
    setTasks(savedTasks);
    toast({
      title: "Reset to last save",
      description: "Your planning checklist has been restored.",
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);
  const requiredTasks = tasks.filter((t) => t.status === "Required" && !t.completed);
  const nextTask = requiredTasks[0];

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-3 sm:p-4 max-w-full">
          {/* Header */}
          <header className="mb-4 z-header relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold">Project Planning</h1>
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Ask Trevor</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                  <PlanningAISidebar />
                </SheetContent>
              </Sheet>
            </div>
          </header>
          
          {/* Project Summary */}
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">🏗️ Project Bell Bird – Cascade Facade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-semibold text-sm">24 Harvest Street</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Progress</p>
                  <p className="font-bold text-base text-primary">{progress}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="font-semibold text-sm">
                    {completedCount} / {tasks.length} tasks
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Next Step</p>
                  <p className="font-semibold text-sm truncate">
                    {nextTask ? nextTask.task : "All done!"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Save Progress</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset to Original</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          </div>

          {/* Planning Views */}
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold mb-3">Planning Checklist</h2>
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="mb-3">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <p className="text-xs text-muted-foreground mb-3">
                  Tick off tasks as you complete them. Assign users and set dates for Gantt chart view.
                </p>
                <PlanningTable
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onAddTask={handleAddTask}
                  onAddSubTask={handleAddSubTask}
                  onDeleteTask={handleDeleteTask}
                  onMoveTaskUp={handleMoveTaskUp}
                  onMoveTaskDown={handleMoveTaskDown}
                  users={MOCK_USERS}
                />
              </TabsContent>
              
              <TabsContent value="gantt">
                <p className="text-xs text-muted-foreground mb-3">
                  Visual timeline of tasks with assigned dates.
                </p>
                <GanttChart tasks={tasks} users={MOCK_USERS} currentUserId="user1" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* AI Sidebar - Desktop Only */}
      <div className="hidden lg:block w-96 border-l z-sidebar relative">
        <PlanningAISidebar />
      </div>
    </div>
  );
};

export default Planning;
