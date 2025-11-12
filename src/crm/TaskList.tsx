import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRMActivity } from "@/types/crm";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Plus } from "lucide-react";
import { CreateActivityDialog } from "./CreateActivityDialog";
import { format, isPast, isToday } from "date-fns";

export function TaskList() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<CRMActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
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
        .eq('activity_type', 'task')
        .order('due_date', { ascending: true, nullsFirst: false });

      if (error) throw error;
      setTasks((data || []) as CRMActivity[]);
    } catch (error: any) {
      toast({
        title: "Error loading tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const completed_at = newStatus === 'completed' ? new Date().toISOString() : null;

    try {
      const { error } = await supabase
        .from('crm_activities')
        .update({ status: newStatus, completed_at })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Task updated",
        description: `Task marked as ${newStatus}`,
      });

      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTaskPriority = (task: CRMActivity) => {
    if (!task.due_date) return null;
    const dueDate = new Date(task.due_date);
    if (isPast(dueDate) && task.status !== 'completed') return 'overdue';
    if (isToday(dueDate)) return 'today';
    return null;
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="space-y-6">
        {/* Pending Tasks */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Pending ({pendingTasks.length})</h3>
          {pendingTasks.map(task => {
            const priority = getTaskPriority(task);
            return (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === 'completed'}
                      onCheckedChange={() => toggleTaskStatus(task.id, task.status || 'pending')}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{task.subject}</h4>
                        {priority === 'overdue' && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                        {priority === 'today' && (
                          <Badge variant="default">Due Today</Badge>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        {task.due_date && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}
                          </div>
                        )}
                        {task.contact && (
                          <Badge variant="secondary" className="text-xs">
                            {task.contact.full_name}
                          </Badge>
                        )}
                        {task.deal && (
                          <Badge variant="outline" className="text-xs">
                            {task.deal.deal_name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {pendingTasks.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending tasks. Great job!
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Completed ({completedTasks.length})</h3>
            {completedTasks.map(task => (
              <Card key={task.id} className="opacity-60">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => toggleTaskStatus(task.id, task.status || 'completed')}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold line-through">{task.subject}</h4>
                      {task.contact && (
                        <Badge variant="secondary" className="text-xs">
                          {task.contact.full_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CreateActivityDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onActivityCreated={handleTaskCreated}
      />
    </div>
  );
}
