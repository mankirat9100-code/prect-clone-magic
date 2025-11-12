import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DirectoryResult } from '@/types/team';
import { Star, MapPin, Clock, Globe, Phone, MessageSquare, Eye, Plus, Check } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ConsultantResultCardProps {
  consultant: DirectoryResult;
  onAdd: (result: DirectoryResult, taskRole?: string) => void;
  onMessage: (company: string, role: string) => void;
  availableTasks: { role: string; id: string }[];
  isSelected?: boolean;
}

export const ConsultantResultCard = ({
  consultant,
  onAdd,
  onMessage,
  availableTasks,
  isSelected
}: ConsultantResultCardProps) => {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  const handleViewProfile = () => {
    navigate(`/consultant-profile/${consultant.id}`);
  };

  const handleAdd = () => {
    // Find default task that matches this consultant's role
    const defaultTask = availableTasks.find(t => 
      t.role.toLowerCase().includes(consultant.role.toLowerCase().split(' ')[0])
    );

    if (defaultTask) {
      setSelectedTask(defaultTask.role);
    }
    setShowAddDialog(true);
  };

  const confirmAdd = () => {
    onAdd(consultant, selectedTask);
    setIsAdded(true);
    setShowAddDialog(false);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <>
      <Card className={`transition-all ${isSelected ? 'ring-2 ring-primary shadow-lg' : ''}`}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            {/* Logo/Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {consultant.companyName.charAt(0)}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {consultant.companyName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {consultant.specialty}
                  </p>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {consultant.rating}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {consultant.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {consultant.responseTime}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  website.com
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  0412 345 678
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewProfile}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
                <Button
                  variant={isAdded ? "default" : "outline"}
                  size="sm"
                  onClick={handleAdd}
                  className="flex-1"
                  disabled={isAdded}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Added
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMessage(consultant.companyName, consultant.role)}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add to Task Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {consultant.companyName} to Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select which task you'd like to add this consultant to:
            </p>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger>
                <SelectValue placeholder="Select a task..." />
              </SelectTrigger>
              <SelectContent>
                {availableTasks.map((task) => (
                  <SelectItem key={task.id} value={task.role}>
                    {task.role}
                  </SelectItem>
                ))}
                <SelectItem value="new-task">+ Create New Task</SelectItem>
              </SelectContent>
            </Select>
            {selectedTask && (
              <div className="bg-primary/10 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Smart Match:</p>
                <p className="text-muted-foreground">
                  {consultant.companyName} specializes in {consultant.specialty}, 
                  making them a great fit for {selectedTask || 'this task'}.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAdd} disabled={!selectedTask}>
              Add to Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
