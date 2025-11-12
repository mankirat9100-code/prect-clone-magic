import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface EmployeeHours {
  name: string;
  initials: string;
  lastWeek: number;
  thisWeek: number;
  weeklyTarget: number;
}

const mockEmployeeData: EmployeeHours[] = [
  { name: "John Doe", initials: "JD", lastWeek: 42, thisWeek: 28, weeklyTarget: 40 },
  { name: "Sarah Miller", initials: "SM", lastWeek: 38, thisWeek: 32, weeklyTarget: 40 },
  { name: "Tom Harris", initials: "TH", lastWeek: 45, thisWeek: 35, weeklyTarget: 40 },
  { name: "Emma Wilson", initials: "EW", lastWeek: 40, thisWeek: 30, weeklyTarget: 40 },
];

export function HoursTrackingTable() {
  const totalLastWeek = mockEmployeeData.reduce((sum, emp) => sum + emp.lastWeek, 0);
  const totalThisWeek = mockEmployeeData.reduce((sum, emp) => sum + emp.thisWeek, 0);

  return (
    <Card className="relative bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md">
            <Clock className="h-5 w-5 text-white" />
          </div>
          Team Hours Logged
        </CardTitle>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <div className="text-sm text-muted-foreground">Last Week Total</div>
            <div className="text-2xl font-bold text-accent">{totalLastWeek}h</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-sm text-muted-foreground">This Week Total</div>
            <div className="text-2xl font-bold text-primary">{totalThisWeek}h</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-4">
          {mockEmployeeData.map((employee) => (
            <div key={employee.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {employee.initials}
                  </div>
                  <span className="font-medium">{employee.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: {employee.weeklyTarget}h/week
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Week</span>
                    <span className="font-medium text-accent">{employee.lastWeek}h</span>
                  </div>
                  <Progress 
                    value={(employee.lastWeek / employee.weeklyTarget) * 100} 
                    className="h-2 bg-muted"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">This Week</span>
                    <span className="font-medium text-primary">{employee.thisWeek}h</span>
                  </div>
                  <Progress 
                    value={(employee.thisWeek / employee.weeklyTarget) * 100} 
                    className="h-2 bg-muted"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
