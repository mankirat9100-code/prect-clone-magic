import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProjectSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PROJECT_TYPES = ["House", "Pool", "Addition", "Shed", "Other"];

export function ProjectSetupDialog({ open, onOpenChange }: ProjectSetupDialogProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");

  const handleNext = () => {
    if (step === 1 && projectName) {
      setStep(2);
    } else if (step === 2 && projectType) {
      // Navigate to Ask Trevor page with project details
      navigate("/ask-trevor", { state: { projectName, projectType } });
      onOpenChange(false);
      // Reset for next time
      setStep(1);
      setProjectName("");
      setProjectType("");
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setProjectName("");
    setProjectType("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        {step === 1 ? (
          <>
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-bold tracking-tight">What's your project name?</DialogTitle>
              <DialogDescription className="text-base">
                Give your project a memorable name to get started
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-3">
                <Label htmlFor="projectName" className="text-base font-semibold">Project name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Smith Family Home"
                  autoFocus
                  className="h-12 text-base"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} size="lg" className="min-w-24">
                Cancel
              </Button>
              <Button onClick={handleNext} disabled={!projectName} size="lg" className="min-w-24">
                Next
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-3xl font-bold tracking-tight">What is the project type?</DialogTitle>
              <DialogDescription className="text-base">
                Select the type that best describes your project
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <RadioGroup value={projectType} onValueChange={setProjectType} className="space-y-3">
                {PROJECT_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <RadioGroupItem value={type} id={type} className="h-5 w-5" />
                    <Label htmlFor={type} className="cursor-pointer font-medium text-base flex-1">
                      {type}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-between gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} size="lg" className="min-w-24">
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose} size="lg" className="min-w-24">
                  Cancel
                </Button>
                <Button onClick={handleNext} disabled={!projectType} size="lg" className="min-w-28">
                  Continue
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
