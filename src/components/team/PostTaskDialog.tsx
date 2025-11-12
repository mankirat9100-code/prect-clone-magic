import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PostTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: string;
  projectName: string;
}

// Available categories for task classification
const AVAILABLE_CATEGORIES = [
  'Architecture',
  'Building Design',
  'Planning',
  'Engineering',
  'Construction',
  'Surveying',
  'Interior Design',
  'Landscape Architecture',
];

// Map roles to relevant categories
const getRoleCategories = (role: string): string[] => {
  const roleLower = role.toLowerCase();
  const categories: string[] = [];
  
  if (roleLower.includes('architect')) {
    categories.push('Architecture', 'Building Design');
  } else if (roleLower.includes('building designer') || roleLower.includes('designer')) {
    categories.push('Building Design', 'Architecture', 'Planning');
  } else if (roleLower.includes('planner') || roleLower.includes('planning')) {
    categories.push('Planning', 'Architecture');
  } else if (roleLower.includes('engineer')) {
    categories.push('Engineering', 'Construction');
  } else if (roleLower.includes('surveyor')) {
    categories.push('Surveying', 'Engineering');
  } else if (roleLower.includes('interior')) {
    categories.push('Interior Design', 'Architecture');
  } else if (roleLower.includes('landscape')) {
    categories.push('Landscape Architecture', 'Planning');
  }
  
  return categories;
};

export function PostTaskDialog({ open, onOpenChange, role, projectName }: PostTaskDialogProps) {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open && role) {
      setTaskTitle(role);
      
      // Auto-select relevant categories based on role
      const roleCategories = getRoleCategories(role);
      setSelectedCategories(roleCategories);
      
      // AI-generated description based on role
      const generatedDescription = `We are seeking a qualified ${role} for our project at ${projectName}.

Project Overview:
This is a residential development project requiring professional ${role.toLowerCase()} services.

Key Requirements:
- Experience with similar residential projects
- Knowledge of local building codes and regulations
- Ability to deliver high-quality work on schedule
- Strong communication and collaboration skills

Project Details:
Please review the attached documents for complete project specifications and requirements.

How to Apply:
Submit your proposal including:
- Your relevant experience and qualifications
- Proposed timeline
- Fee structure
- References from similar projects

We look forward to reviewing your proposal.`;

      setDescription(generatedDescription);
    }
  }, [open, role, projectName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleAiEnhance = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'AI Prompt Required',
        description: 'Please enter instructions for the AI.',
        variant: 'destructive',
      });
      return;
    }

    // Simulate AI enhancement
    toast({
      title: 'AI Enhancement Applied',
      description: 'The task description has been enhanced based on your prompt.',
    });
    setAiPrompt('');
  };

  const handlePost = () => {
    if (!description.trim()) {
      toast({
        title: 'Description Required',
        description: 'Please provide a task description.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Task Posted',
      description: `Your ${role} task has been posted successfully.`,
    });

    // Reset form
    setTaskTitle('');
    setDescription('');
    setAiPrompt('');
    setAttachments([]);
    setSelectedCategories([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Task</DialogTitle>
          <DialogDescription>
            Create a task posting for {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="taskTitle">Task Title</Label>
            <Input
              id="taskTitle"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., Building Designer"
            />
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="projectName">Project</Label>
            <Input
              id="projectName"
              value={projectName}
              disabled
              className="bg-muted"
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>Categories</Label>
            <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-muted/50">
              {AVAILABLE_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Select relevant categories for this task
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Task Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              className="min-h-[200px]"
            />
          </div>

          {/* AI Enhancement */}
          <div className="space-y-2 p-4 border rounded-lg bg-accent/50">
            <Label htmlFor="aiPrompt">Enhance with AI</Label>
            <div className="flex gap-2">
              <Input
                id="aiPrompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Make it more professional, Add budget details..."
              />
              <Button onClick={handleAiEnhance} variant="secondary">
                Enhance
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ask AI to modify the description above
            </p>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Paperclip className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                    >
                      <span className="truncate">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Attach relevant project documents (plans, specifications, etc.)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePost}>
            Post Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
