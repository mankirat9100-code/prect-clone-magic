import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronDown, CalendarIcon, ArrowUp, ArrowDown, StickyNote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface PlanningTask {
  id: string;
  stage: string;
  task: string;
  status: "Required" | "Not Required" | "Pending" | "Complete" | "Needs Action";
  notes: string;
  completed: boolean;
  parentId?: string;
  assignedTo?: string;
  startDate?: Date;
  endDate?: Date;
}

interface PlanningTableProps {
  tasks: PlanningTask[];
  onTaskUpdate: (id: string, field: keyof PlanningTask, value: string | boolean | Date | undefined) => void;
  onAddTask: (afterId: string) => void;
  onAddSubTask: (parentId: string) => void;
  onDeleteTask: (id: string) => void;
  onMoveTaskUp: (id: string) => void;
  onMoveTaskDown: (id: string) => void;
  users: Array<{ id: string; name: string }>;
}

export const PlanningTable = ({
  tasks,
  onTaskUpdate,
  onAddTask,
  onAddSubTask,
  onDeleteTask,
  onMoveTaskUp,
  onMoveTaskDown,
  users,
}: PlanningTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Complete":
        return "default";
      case "Required":
        return "destructive";
      case "Needs Action":
        return "destructive";
      case "Pending":
        return "secondary";
      case "Not Required":
        return "outline";
      default:
        return "outline";
    }
  };

  // Group tasks by stage (only parent tasks)
  const parentTasks = tasks.filter(task => !task.parentId);
  const groupedTasks = parentTasks.reduce((acc, task) => {
    if (!acc[task.stage]) {
      acc[task.stage] = [];
    }
    acc[task.stage].push(task);
    return acc;
  }, {} as Record<string, PlanningTask[]>);

  // Get sub-tasks for a parent task
  const getSubTasks = (parentId: string) => {
    return tasks.filter(task => task.parentId === parentId);
  };

  const getStageStatus = (stageTasks: PlanningTask[]) => {
    // Count all tasks including sub-tasks
    const allTasksInStage = tasks.filter(t => 
      stageTasks.some(st => st.id === t.id || st.id === t.parentId)
    );
    const completedCount = allTasksInStage.filter((t) => t.completed).length;
    const totalCount = allTasksInStage.length;
    if (completedCount === totalCount) return "Complete";
    if (completedCount > 0) return "In Progress";
    return "Required";
  };

  const renderTask = (task: PlanningTask, isSubTask: boolean = false) => {
    const subTasks = getSubTasks(task.id);
    
    return (
      <div key={task.id}>
        <div
          className={`flex items-center gap-2 p-2 rounded-lg border transition-colors overflow-x-auto ${
            task.completed ? "bg-muted/50" : "bg-background hover:bg-muted/30"
          } ${isSubTask ? "ml-8" : ""}`}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) =>
              onTaskUpdate(task.id, "completed", checked as boolean)
            }
            className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 shrink-0"
          />
          <Input
            value={task.task}
            onChange={(e) => onTaskUpdate(task.id, "task", e.target.value)}
            className={`w-36 min-w-[120px] border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 font-medium h-8 text-sm ${
              task.completed ? "line-through text-muted-foreground" : ""
            }`}
            placeholder="Task name..."
          />
          
          {/* Assigned To */}
          <Select
            value={task.assignedTo}
            onValueChange={(value) => onTaskUpdate(task.id, "assignedTo", value)}
          >
            <SelectTrigger className="w-32 h-8 shrink-0 text-sm">
              <SelectValue placeholder="Assign to..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Start Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-28 h-8 justify-start text-left font-normal shrink-0 text-xs",
                  !task.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {task.startDate ? format(task.startDate, "MMM dd") : "Start"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={task.startDate}
                onSelect={(date) => onTaskUpdate(task.id, "startDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {/* End Date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-28 h-8 justify-start text-left font-normal shrink-0 text-xs",
                  !task.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-1 h-3 w-3" />
                {task.endDate ? format(task.endDate, "MMM dd") : "End"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={task.endDate}
                onSelect={(date) => onTaskUpdate(task.id, "endDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Badge variant={getStatusBadgeVariant(task.status)} className="shrink-0 text-xs">
            {task.status}
          </Badge>
          
          <select
            value={task.status}
            onChange={(e) => onTaskUpdate(task.id, "status", e.target.value)}
            className="h-8 px-2 text-xs border rounded-md bg-background shrink-0"
            disabled={task.completed}
          >
            <option value="Required">Required</option>
            <option value="Needs Action">Needs Action</option>
            <option value="Not Required">Not Required</option>
            <option value="Pending">Pending</option>
            <option value="Complete">Complete</option>
          </select>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                >
                  <StickyNote className={`h-4 w-4 ${task.notes ? "text-primary" : "text-muted-foreground"}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-sm">{task.notes || "No notes"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveTaskUp(task.id)}
              className="h-7 w-7 p-0"
              title="Move up"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveTaskDown(task.id)}
              className="h-7 w-7 p-0"
              title="Move down"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            {!isSubTask && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddSubTask(task.id)}
                className="h-7 w-7 p-0"
                title="Add sub-task"
              >
                <Plus className="h-3 w-3" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(task.id)}
              className="h-7 w-7 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteTask(task.id)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {subTasks.map(subTask => renderTask(subTask, true))}
      </div>
    );
  };

  return (
    <Accordion type="multiple" defaultValue={Object.keys(groupedTasks)} className="space-y-4">
      {Object.entries(groupedTasks).map(([stage, stageTasks]) => {
        const stageStatus = getStageStatus(stageTasks);
        const allTasksInStage = tasks.filter(t => 
          stageTasks.some(st => st.id === t.id || st.id === t.parentId)
        );
        const completedInStage = allTasksInStage.filter((t) => t.completed).length;
        
        return (
          <AccordionItem
            key={stage}
            value={stage}
            className="border rounded-lg bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-2">
                  {stage === "Concept & Design" && <span className="text-xl">✏️</span>}
                  {stage === "Planning & Approvals" && <span className="text-xl">📋</span>}
                  {stage === "Tender / Builder Engagement" && <span className="text-xl">🤝</span>}
                  {stage === "Construction" && <span className="text-xl">🏗️</span>}
                  <h3 className="text-base sm:text-lg font-bold text-left">{stage}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {completedInStage}/{allTasksInStage.length}
                  </span>
                  <Badge variant={stageStatus === "Complete" ? "default" : "secondary"} className="text-xs">
                    {stageStatus}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-2 mt-2">
                {stageTasks.map((task) => renderTask(task))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
