import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StageAssessmentAnswers {
  hasDaApproval: boolean | null;
  hasConstructionPlans: "yes" | "no" | "in-progress" | null;
  hasCertifier: boolean | null;
  hasBuilder: boolean | null;
}

interface StageAssessmentProps {
  answers: StageAssessmentAnswers;
  onAnswerChange: (field: keyof StageAssessmentAnswers, value: any) => void;
}

export function StageAssessment({ answers, onAnswerChange }: StageAssessmentProps) {
  const YesNoButton = ({ 
    value, 
    currentValue, 
    onClick, 
    label 
  }: { 
    value: boolean; 
    currentValue: boolean | null; 
    onClick: () => void; 
    label: string;
  }) => {
    const isSelected = currentValue === value;
    
    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        onClick={onClick}
        className={cn(
          "flex-1 gap-2",
          isSelected && (value ? "bg-green-500 hover:bg-green-600" : "bg-slate-500 hover:bg-slate-600")
        )}
      >
        {isSelected ? (
          value ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
        {label}
      </Button>
    );
  };

  const PlanStatusButton = ({ 
    value, 
    currentValue, 
    onClick, 
    label 
  }: { 
    value: "yes" | "no" | "in-progress"; 
    currentValue: "yes" | "no" | "in-progress" | null; 
    onClick: () => void; 
    label: string;
  }) => {
    const isSelected = currentValue === value;
    
    return (
      <Button
        variant={isSelected ? "default" : "outline"}
        onClick={onClick}
        className={cn(
          "flex-1 gap-2",
          isSelected && value === "yes" && "bg-green-500 hover:bg-green-600",
          isSelected && value === "in-progress" && "bg-amber-500 hover:bg-amber-600",
          isSelected && value === "no" && "bg-slate-500 hover:bg-slate-600"
        )}
      >
        {isSelected ? (
          value === "yes" ? <CheckCircle2 className="h-4 w-4" /> : 
          value === "in-progress" ? <Circle className="h-4 w-4" /> :
          <XCircle className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
        {label}
      </Button>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">Let's assess where you are</CardTitle>
        <CardDescription className="text-base">
          Answer these questions to help us provide the most relevant guidance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Question 1: DA Approval */}
        <div className="space-y-3">
          <label className="text-lg font-semibold">
            Do you have Development Application (DA) approval yet?
          </label>
          <div className="flex gap-3">
            <YesNoButton
              value={true}
              currentValue={answers.hasDaApproval}
              onClick={() => onAnswerChange("hasDaApproval", true)}
              label="Yes"
            />
            <YesNoButton
              value={false}
              currentValue={answers.hasDaApproval}
              onClick={() => onAnswerChange("hasDaApproval", false)}
              label="No"
            />
          </div>
        </div>

        {/* Question 2: Construction Plans */}
        <div className="space-y-3">
          <label className="text-lg font-semibold">
            Do you have construction plans?
          </label>
          <div className="flex gap-3">
            <PlanStatusButton
              value="yes"
              currentValue={answers.hasConstructionPlans}
              onClick={() => onAnswerChange("hasConstructionPlans", "yes")}
              label="Yes"
            />
            <PlanStatusButton
              value="in-progress"
              currentValue={answers.hasConstructionPlans}
              onClick={() => onAnswerChange("hasConstructionPlans", "in-progress")}
              label="In Progress"
            />
            <PlanStatusButton
              value="no"
              currentValue={answers.hasConstructionPlans}
              onClick={() => onAnswerChange("hasConstructionPlans", "no")}
              label="No"
            />
          </div>
        </div>

        {/* Question 3: Certifier */}
        <div className="space-y-3">
          <label className="text-lg font-semibold">
            Have you appointed a certifier (PCA)?
          </label>
          <div className="flex gap-3">
            <YesNoButton
              value={true}
              currentValue={answers.hasCertifier}
              onClick={() => onAnswerChange("hasCertifier", true)}
              label="Yes"
            />
            <YesNoButton
              value={false}
              currentValue={answers.hasCertifier}
              onClick={() => onAnswerChange("hasCertifier", false)}
              label="No"
            />
          </div>
        </div>

        {/* Question 4: Builder */}
        <div className="space-y-3">
          <label className="text-lg font-semibold">
            Do you have a builder?
          </label>
          <div className="flex gap-3">
            <YesNoButton
              value={true}
              currentValue={answers.hasBuilder}
              onClick={() => onAnswerChange("hasBuilder", true)}
              label="Yes"
            />
            <YesNoButton
              value={false}
              currentValue={answers.hasBuilder}
              onClick={() => onAnswerChange("hasBuilder", false)}
              label="No"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
