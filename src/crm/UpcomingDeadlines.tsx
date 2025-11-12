import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, ExternalLink } from "lucide-react";
import { format, addDays } from "date-fns";

interface Deadline {
  id: string;
  title: string;
  dueDate: Date;
  type: "task" | "meeting" | "deadline";
  priority: "high" | "medium" | "low";
  relatedTo?: string;
}

const mockDeadlines: Deadline[] = [
  {
    id: "1",
    title: "Submit planning application",
    dueDate: addDays(new Date(), 1),
    type: "deadline",
    priority: "high",
    relatedTo: "Dennis House",
  },
  {
    id: "2",
    title: "Client meeting - Cost review",
    dueDate: addDays(new Date(), 2),
    type: "meeting",
    priority: "high",
    relatedTo: "Bondi Beach Renovation",
  },
  {
    id: "3",
    title: "Follow up with contractor",
    dueDate: addDays(new Date(), 3),
    type: "task",
    priority: "medium",
    relatedTo: "Byron Bay Beach House",
  },
  {
    id: "4",
    title: "Review updated drawings",
    dueDate: addDays(new Date(), 5),
    type: "task",
    priority: "low",
    relatedTo: "Dennis House",
  },
];

const priorityColors = {
  high: "bg-red-500/10 text-red-700 dark:text-red-400",
  medium: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  low: "bg-green-500/10 text-green-700 dark:text-green-400",
};

export function UpcomingDeadlines() {
  const itemsDueInThreeDays = mockDeadlines.filter(
    (d) => d.dueDate <= addDays(new Date(), 3)
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-accent/30 p-3 rounded-lg">
        <Calendar className="h-4 w-4 text-primary" />
        <p>
          You have <strong className="text-foreground">{itemsDueInThreeDays} items</strong> due in the next 3 days.
        </p>
      </div>
      <ScrollArea className="h-[330px] pr-4">
        <div className="space-y-3">
          {mockDeadlines.map((deadline) => (
            <div
              key={deadline.id}
              className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all group bg-card"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
                  {deadline.title}
                </h4>
                <Badge variant="outline" className={priorityColors[deadline.priority]}>
                  {deadline.priority}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{format(deadline.dueDate, "MMM d, yyyy")}</span>
                </div>
                {deadline.relatedTo && (
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    {deadline.relatedTo}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
