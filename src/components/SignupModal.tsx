import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function SignupModal({ open, onOpenChange, onSuccess }: SignupModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      navigate("/auth?mode=signup");
      onOpenChange(false);
    }
  }, [open, navigate, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create free account to continue</DialogTitle>
          <DialogDescription>
            You've reached the limit of free questions. Create an account to continue chatting with Trevor.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Redirecting to signup page...
          </p>
          <Button onClick={() => navigate("/auth?mode=signup")} className="w-full">
            Go to Signup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
