import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function DashboardCard({
  title,
  icon: Icon,
  children,
  actionLabel,
  onAction,
  className = "",
}: DashboardCardProps) {
  return (
    <Card className={`relative bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group overflow-hidden ${className}`}>
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
      <CardHeader className="relative flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <Icon className="h-5 w-5 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {children}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            className="w-full mt-4 border-primary/30 hover:bg-primary/10 hover:border-primary"
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
