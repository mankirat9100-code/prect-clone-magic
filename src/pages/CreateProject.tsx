import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateProject = () => {
    if (!projectName || !projectType || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Project Created!",
      description: `${projectName} has been created successfully.`,
    });

    // Navigate to dashboard
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Plus className="h-8 w-8 text-primary" />
            Create New Project
          </h1>
          <p className="text-muted-foreground text-lg">
            Set up a new project to start managing your construction journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="project-name">
                Project Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="project-name"
                placeholder="e.g., 001 Dennis House"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="project-type">
                Project Type <span className="text-destructive">*</span>
              </Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger id="project-type">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-house">New House</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                  <SelectItem value="extension">Extension</SelectItem>
                  <SelectItem value="retaining-wall">Retaining Wall</SelectItem>
                  <SelectItem value="commercial">Commercial Build</SelectItem>
                  <SelectItem value="granny-flat">Granny Flat</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">
                Project Address <span className="text-destructive">*</span>
              </Label>
              <Input
                id="address"
                placeholder="e.g., 24 Harvest Street, Thrumster, NSW"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your project goals, requirements, and any important details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleCreateProject}
                size="lg"
                className="flex-1"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Project
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What happens next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Your project will be created and added to your dashboard
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  You can start adding team members, documents, and tracking progress
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  Trevor AI will help guide you through each stage of the project
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>
                  You can customize project details anytime from the project settings
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateProject;
