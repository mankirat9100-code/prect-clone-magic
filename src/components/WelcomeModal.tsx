import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function WelcomeModal({ open, onOpenChange }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-center">Welcome to Ask Trevor!</DialogTitle>
          <DialogDescription className="text-center space-y-4">
            <p className="text-base">
              You now have unlimited access to Trevor AI and can connect with real construction consultants.
            </p>
            <div className="space-y-3 text-left mt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Unlimited AI Conversations</p>
                  <p className="text-sm text-muted-foreground">Ask Trevor anything about your construction project</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Real Consultant Matches</p>
                  <p className="text-sm text-muted-foreground">Get connected with pre-vetted professionals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Project Management Tools</p>
                  <p className="text-sm text-muted-foreground">Track costs, planning, and documentation</p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6">
          <Button onClick={() => onOpenChange(false)} className="w-full" size="lg">
            Start Using Ask Trevor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
