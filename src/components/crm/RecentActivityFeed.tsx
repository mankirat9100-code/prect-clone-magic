import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
  user: string;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "deal",
    description: "New deal added: Bondi Beach Renovation",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    user: "JD",
  },
  {
    id: "2",
    type: "project",
    description: "Project completed: Byron Bay Beach House",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    user: "SM",
  },
  {
    id: "3",
    type: "contact",
    description: "Contact updated: Sarah Miller",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    user: "TH",
  },
  {
    id: "4",
    type: "hours",
    description: "Hours logged: 6.5 hours on Dennis House",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    user: "JD",
  },
];

export function RecentActivityFeed() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {mockActivities.map((activity) => (
          <div
            key={activity.id}
            className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-white text-xs">
                {activity.user}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(activity.timestamp, "MMM d, h:mm a")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
