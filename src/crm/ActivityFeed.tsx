import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRMActivity } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Calendar, CheckSquare, FileText, Plus } from "lucide-react";
import { CreateActivityDialog } from "./CreateActivityDialog";
import { formatDistanceToNow } from "date-fns";

const ACTIVITY_ICONS = {
  call: Phone,
  email: Mail,
  meeting: Calendar,
  task: CheckSquare,
  note: FileText,
};

const ACTIVITY_COLORS = {
  call: "text-blue-500",
  email: "text-purple-500",
  meeting: "text-green-500",
  task: "text-orange-500",
  note: "text-slate-500",
};

export function ActivityFeed() {
  const { toast } = useToast();
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('crm_activities')
        .select(`
          *,
          contact:crm_contacts(*),
          deal:crm_deals(*)
        `)
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities((data || []) as CRMActivity[]);
    } catch (error: any) {
      toast({
        title: "Error loading activities",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityCreated = () => {
    fetchActivities();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Recent Activities</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Log Activity
        </Button>
      </div>

      <div className="space-y-3">
        {activities.map(activity => {
          const Icon = ACTIVITY_ICONS[activity.activity_type];
          const colorClass = ACTIVITY_COLORS[activity.activity_type];

          return (
            <Card key={activity.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`mt-1 ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{activity.subject}</h4>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    {activity.description && (
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    )}

                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="capitalize">
                        {activity.activity_type}
                      </Badge>
                      {activity.contact && (
                        <Badge variant="secondary">
                          {activity.contact.full_name}
                        </Badge>
                      )}
                      {activity.status && (
                        <Badge 
                          variant={activity.status === 'completed' ? 'default' : 'outline'}
                        >
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {activities.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No activities yet. Log your first activity to get started.
            </CardContent>
          </Card>
        )}
      </div>

      <CreateActivityDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onActivityCreated={handleActivityCreated}
      />
    </div>
  );
}
