import { PlanningTask } from "./PlanningTable";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, differenceInDays, startOfWeek, endOfWeek, startOfQuarter, endOfQuarter, addDays, addWeeks, addMonths, isWeekend, getWeek, getISOWeek, isSameMonth } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface GanttChartProps {
  tasks: PlanningTask[];
  users: Array<{ id: string; name: string }>;
  currentUserId?: string;
}

export const GanttChart = ({ tasks, users, currentUserId }: GanttChartProps) => {
  const [timePeriod, setTimePeriod] = useState<"days" | "weeks" | "months" | "quarters">("weeks");
  const [taskFilter, setTaskFilter] = useState<"all" | "incomplete" | "complete" | "my-tasks">("all");

  // Filter tasks based on selected filter
  let filteredTasks = tasks;
  if (taskFilter === "incomplete") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (taskFilter === "complete") {
    filteredTasks = tasks.filter(task => task.completed);
  } else if (taskFilter === "my-tasks" && currentUserId) {
    filteredTasks = tasks.filter(task => task.assignedTo === currentUserId);
  }
  
  const tasksWithDates = filteredTasks.filter(task => task.startDate && task.endDate);

  // Find date range - default to current month if no dates
  let chartStartDate: Date;
  let chartEndDate: Date;
  
  if (tasksWithDates.length > 0) {
    const allDates = tasksWithDates.flatMap(t => [t.startDate!, t.endDate!]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Adjust date range based on time period
    switch (timePeriod) {
      case "days":
        chartStartDate = new Date(minDate);
        chartEndDate = addDays(maxDate, 7);
        break;
      case "weeks":
        chartStartDate = startOfWeek(minDate);
        chartEndDate = endOfWeek(addWeeks(maxDate, 2));
        break;
      case "months":
        chartStartDate = startOfMonth(minDate);
        chartEndDate = endOfMonth(addMonths(maxDate, 1));
        break;
      case "quarters":
        chartStartDate = startOfQuarter(minDate);
        chartEndDate = endOfQuarter(maxDate);
        break;
    }
  } else {
    // Default to current month
    const today = new Date();
    chartStartDate = startOfMonth(today);
    chartEndDate = endOfMonth(today);
  }
  
  const totalDays = differenceInDays(chartEndDate, chartStartDate) + 1;
  
  // Generate all days for background coloring
  const allDays = eachDayOfInterval({ start: chartStartDate, end: chartEndDate });
  
  // Generate month headers (for days and weeks view)
  const monthHeaders: { month: string; startIdx: number; spanDays: number }[] = [];
  let lastMonth = "";
  let monthStartIdx = 0;
  
  allDays.forEach((day, idx) => {
    const monthYear = format(day, "MMMM");
    if (monthYear !== lastMonth) {
      if (lastMonth !== "") {
        monthHeaders.push({
          month: lastMonth,
          startIdx: monthStartIdx,
          spanDays: idx - monthStartIdx
        });
      }
      lastMonth = monthYear;
      monthStartIdx = idx;
    }
  });
  // Add last month
  if (lastMonth !== "") {
    monthHeaders.push({
      month: lastMonth,
      startIdx: monthStartIdx,
      spanDays: allDays.length - monthStartIdx
    });
  }
  
  // Generate time periods for headers
  const timeHeaders: { date: Date; label: string; subLabel?: string; daysWidth: number }[] = [];
  let currentDate = new Date(chartStartDate);
  
  switch (timePeriod) {
    case "days":
      // For days, we just show the day number, months are in separate row
      while (currentDate <= chartEndDate) {
        timeHeaders.push({
          date: new Date(currentDate),
          label: format(currentDate, "d"),
          daysWidth: 1
        });
        currentDate = addDays(currentDate, 1);
      }
      break;
    case "weeks":
      while (currentDate <= chartEndDate) {
        const weekEnd = addDays(currentDate, 6);
        const weekNum = getISOWeek(currentDate);
        timeHeaders.push({
          date: new Date(currentDate),
          label: `W${weekNum}`,
          subLabel: `${format(currentDate, "d")} - ${format(weekEnd, "d")}`,
          daysWidth: 7
        });
        currentDate = addDays(currentDate, 7);
      }
      break;
    case "months":
      while (currentDate <= chartEndDate) {
        const monthStart = new Date(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
        timeHeaders.push({
          date: new Date(currentDate),
          label: format(currentDate, "MMMM yyyy"),
          daysWidth: daysInMonth
        });
        currentDate = addMonths(currentDate, 1);
      }
      break;
    case "quarters":
      while (currentDate <= chartEndDate) {
        const quarterStart = startOfQuarter(currentDate);
        const quarterEnd = endOfQuarter(currentDate);
        const daysInQuarter = differenceInDays(quarterEnd, quarterStart) + 1;
        const quarterNum = Math.floor(currentDate.getMonth() / 3) + 1;
        timeHeaders.push({
          date: new Date(currentDate),
          label: `Q${quarterNum} ${format(currentDate, "yyyy")}`,
          daysWidth: daysInQuarter
        });
        currentDate = addMonths(currentDate, 3);
      }
      break;
  }

  const getTaskPosition = (task: PlanningTask) => {
    if (!task.startDate || !task.endDate) return null;
    
    const startOffset = differenceInDays(task.startDate, chartStartDate);
    const duration = differenceInDays(task.endDate, task.startDate) + 1;
    
    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;
    
    return { leftPercent, widthPercent };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete": return "bg-green-500";
      case "Required": return "bg-red-500";
      case "Needs Action": return "bg-orange-500";
      case "Pending": return "bg-yellow-500";
      case "Not Required": return "bg-gray-400";
      default: return "bg-blue-500";
    }
  };

  const getUserName = (userId?: string) => {
    if (!userId) return "Unassigned";
    return users.find(u => u.id === userId)?.name || "Unknown";
  };

  // Group ALL filtered tasks by stage (not just ones with dates)
  const parentTasks = filteredTasks.filter(task => !task.parentId);
  const groupedTasks = parentTasks.reduce((acc, task) => {
    if (!acc[task.stage]) {
      acc[task.stage] = [];
    }
    acc[task.stage].push(task);
    return acc;
  }, {} as Record<string, PlanningTask[]>);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time Period:</span>
          <div className="flex gap-1">
            <Button
              variant={timePeriod === "days" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("days")}
            >
              Days
            </Button>
            <Button
              variant={timePeriod === "weeks" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("weeks")}
            >
              Weeks
            </Button>
            <Button
              variant={timePeriod === "months" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("months")}
            >
              Months
            </Button>
            <Button
              variant={timePeriod === "quarters" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimePeriod("quarters")}
            >
              Quarters
            </Button>
          </div>
        </div>
        
        <div className="h-8 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Show:</span>
          <div className="flex gap-1">
            <Button
              variant={taskFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setTaskFilter("all")}
            >
              All Tasks
            </Button>
            <Button
              variant={taskFilter === "incomplete" ? "default" : "outline"}
              size="sm"
              onClick={() => setTaskFilter("incomplete")}
            >
              Incomplete
            </Button>
            <Button
              variant={taskFilter === "complete" ? "default" : "outline"}
              size="sm"
              onClick={() => setTaskFilter("complete")}
            >
              Complete
            </Button>
            <Button
              variant={taskFilter === "my-tasks" ? "default" : "outline"}
              size="sm"
              onClick={() => setTaskFilter("my-tasks")}
            >
              My Tasks
            </Button>
          </div>
        </div>
      </div>

      {Object.entries(groupedTasks).map(([stage, stageTasks]) => (
        <div key={stage} className="border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-3">
            <h3 className="font-bold text-lg">{stage}</h3>
          </div>
          
          <div className="p-4">
            {/* Timeline Header */}
            <div className="flex mb-4">
              <div className="w-64 shrink-0"></div>
              <div className="flex-1 relative">
                {/* Month headers for days and weeks view */}
                {(timePeriod === "days" || timePeriod === "weeks") && (
                  <div className="flex border-b bg-muted/30">
                    {monthHeaders.map((month, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-semibold text-center py-2 border-r last:border-r-0"
                        style={{ width: `${(month.spanDays / totalDays) * 100}%` }}
                      >
                        {month.month}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Day/Week/Month headers */}
                <div className="flex border-b">
                  {timeHeaders.map((header, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-center border-r last:border-r-0"
                      style={{ width: `${(header.daysWidth / totalDays) * 100}%` }}
                    >
                      <div className="py-2 font-medium">{header.label}</div>
                      {header.subLabel && (
                        <div className="py-1 text-muted-foreground border-t">{header.subLabel}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-2">
              {stageTasks.map((task) => {
                const position = getTaskPosition(task);

                return (
                  <div key={task.id} className="flex items-center">
                    <div className="w-64 shrink-0 pr-4">
                      <div className={`text-sm font-medium truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.task}
                      </div>
                      <div className="text-xs text-muted-foreground">{getUserName(task.assignedTo)}</div>
                    </div>
                    <div className="flex-1 relative h-10">
                      {/* Background grid with weekend highlighting */}
                      <div className="absolute inset-0 flex">
                        {allDays.map((day, idx) => (
                          <div
                            key={idx}
                            className={`border-r last:border-r-0 ${
                              isWeekend(day) ? 'bg-muted/60' : 'bg-background'
                            }`}
                            style={{ width: `${(1 / totalDays) * 100}%` }}
                          />
                        ))}
                      </div>
                      {position && (
                        <div
                          className={`absolute top-1 h-8 rounded flex items-center px-2 ${getStatusColor(task.status)} text-white text-xs font-medium z-10`}
                          style={{
                            left: `${position.leftPercent}%`,
                            width: `${position.widthPercent}%`,
                          }}
                        >
                          <span className="truncate">
                            {format(task.startDate!, "MMM dd")} - {format(task.endDate!, "MMM dd")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
