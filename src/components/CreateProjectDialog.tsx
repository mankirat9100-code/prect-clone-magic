import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Mic, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PROJECT_TYPES = [
  "New House",
  "Renovation",
  "Extension",
  "Retaining Wall",
  "Commercial Build",
  "Granny Flat",
  "Carport",
  "Deck",
  "Pool",
  "Subdivision",
  "Other",
];

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [filteredTypes, setFilteredTypes] = useState<string[]>([]);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleProjectTypeChange = (value: string) => {
    setProjectType(value);
    if (value) {
      const filtered = PROJECT_TYPES.filter((type) =>
        type.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTypes(filtered);
      setShowTypeDropdown(true);
    } else {
      setFilteredTypes([]);
      setShowTypeDropdown(false);
    }
  };

  const selectProjectType = (type: string) => {
    setProjectType(type);
    setShowTypeDropdown(false);
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setDescription(description + (description ? " " : "") + transcript);
    };

    recognition.onerror = () => {
      toast({
        title: "Error",
        description: "Voice input failed",
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const generateDescription = async () => {
    if (!address || !projectType) {
      toast({
        title: "Missing Information",
        description: "Please enter address and project type first",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-project-description", {
        body: { address, projectType },
      });

      if (error) throw error;

      if (data?.description) {
        setDescription(data.description);
        toast({
          title: "AI Generated",
          description: "Project description generated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleCreateProject = () => {
    if (!address || !projectType || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Created!",
      description: "Your project has been created successfully.",
    });

    // Reset form and close dialog
    setAddress("");
    setProjectType("");
    setDescription("");
    onOpenChange(false);

    // Navigate to the new project (or refresh dashboard)
    setTimeout(() => navigate("/"), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="space-y-4 pb-2">
          <DialogTitle className="flex items-center gap-3 text-3xl font-bold tracking-tight">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            Create New Project
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter your project details to get started
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Address */}
          <div className="space-y-3">
            <Label htmlFor="address" className="text-base font-semibold">
              Project Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="address"
              placeholder="Start typing the address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              autoComplete="off"
              className="h-12 text-base"
            />
            <p className="text-sm text-muted-foreground">
              Type to search for the address
            </p>
          </div>

          {/* Project Type with Autocomplete */}
          <div className="space-y-3 relative">
            <Label htmlFor="project-type" className="text-base font-semibold">
              Project Type <span className="text-destructive">*</span>
            </Label>
            <Input
              id="project-type"
              placeholder="Start typing to filter project types..."
              value={projectType}
              onChange={(e) => handleProjectTypeChange(e.target.value)}
              onFocus={() => {
                if (projectType) {
                  const filtered = PROJECT_TYPES.filter((type) =>
                    type.toLowerCase().includes(projectType.toLowerCase())
                  );
                  setFilteredTypes(filtered);
                  setShowTypeDropdown(true);
                }
              }}
              autoComplete="off"
              className="h-12 text-base"
            />
            {showTypeDropdown && filteredTypes.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-48 overflow-auto">
                {filteredTypes.map((type) => (
                  <div
                    key={type}
                    className="px-4 py-3 hover:bg-accent cursor-pointer text-base font-medium transition-colors"
                    onClick={() => selectProjectType(type)}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description with Voice and AI */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-base font-semibold">
              Project Description <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-3">
              <Textarea
                id="description"
                placeholder="Describe your project goals and requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[140px] flex-1 text-base"
              />
              <div className="flex flex-col gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={startVoiceInput}
                  disabled={isListening}
                  title="Voice input"
                  className="h-12 w-12"
                >
                  <Mic className={`h-5 w-5 ${isListening ? "text-red-500" : ""}`} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateDescription}
                  disabled={aiLoading}
                  title="AI generate"
                  className="h-12 w-12"
                >
                  {aiLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Use the microphone for voice input or sparkle icon for AI generation
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={handleCreateProject} className="flex-1" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Create Project
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} size="lg" className="min-w-28">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
