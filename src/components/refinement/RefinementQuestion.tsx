import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
}

interface RefinementQuestionProps {
  questionNumber: number;
  questionKey: string;
  label: string;
  options?: string[];
  type?: "radio" | "number" | "text";
  value?: string;
  isCompleted?: boolean;
  onSave: (value: string) => void;
  onEdit?: () => void;
  assignedTo?: string;
  onAssignChange?: (memberId: string) => void;
  teamMembers?: TeamMember[];
}

export const RefinementQuestion = ({
  questionNumber,
  questionKey,
  label,
  options = [],
  type = "radio",
  value = "",
  isCompleted = false,
  onSave,
  onEdit,
  assignedTo,
  onAssignChange,
  teamMembers = [],
}: RefinementQuestionProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [showOther, setShowOther] = useState(
    value && options.length > 0 && !options.includes(value)
  );
  const [otherValue, setOtherValue] = useState(
    value && !options.includes(value) ? value : ""
  );

  const handleRadioChange = (val: string) => {
    if (val === "Other") {
      setShowOther(true);
      setCurrentValue("");
    } else {
      setShowOther(false);
      setCurrentValue(val);
      onSave(val);
    }
  };

  const handleOtherSave = () => {
    if (otherValue.trim()) {
      setCurrentValue(otherValue);
      onSave(otherValue);
    }
  };

  const handleNumberOrTextChange = (val: string) => {
    setCurrentValue(val);
  };

  const handleNumberOrTextBlur = () => {
    if (currentValue.trim()) {
      onSave(currentValue);
    }
  };

  const assignedMember = teamMembers.find(m => m.id === assignedTo);

  // Display mode for completed questions
  if (isCompleted && onEdit) {
    return (
      <div className="border-b pb-6 mb-6 last:border-b-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3 mb-2">
              <span className="text-sm font-semibold text-muted-foreground flex-shrink-0">Q{questionNumber}</span>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
            <p className="font-medium sm:ml-9">{value}</p>
            {assignedMember && (
              <div className="flex items-center gap-2 mt-2 sm:ml-9 text-sm text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Assigned to: {assignedMember.full_name}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onEdit} className="flex-shrink-0 self-start">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // Edit mode for outstanding questions
  return (
    <div className="border-b pb-6 mb-6 last:border-b-0">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-lg font-bold text-primary flex-shrink-0">Q{questionNumber}</span>
            <Label className="text-base font-semibold">{label}</Label>
          </div>
          {onAssignChange && (
            <div className="w-full sm:w-auto sm:flex-shrink-0">
              <Select value={assignedTo} onValueChange={onAssignChange}>
                <SelectTrigger className="w-full sm:w-[240px] bg-card">
                  <User className="h-3 w-3 mr-2" />
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {teamMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <div className="sm:ml-9">
          {type === "radio" && options.length > 0 && (
            <RadioGroup value={currentValue} onValueChange={handleRadioChange}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {options.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${questionKey}-${option}`} />
                    <Label
                      htmlFor={`${questionKey}-${option}`}
                      className="font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Other" id={`${questionKey}-Other`} />
                  <Label
                    htmlFor={`${questionKey}-Other`}
                    className="font-normal cursor-pointer"
                  >
                    Other
                  </Label>
                </div>
              </div>
            </RadioGroup>
          )}

          {showOther && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter custom value"
                value={otherValue}
                onChange={(e) => setOtherValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleOtherSave()}
              />
              <Button onClick={handleOtherSave} size="icon">
                <Check className="h-4 w-4" />
              </Button>
            </div>
          )}

          {type === "number" && (
            <Input
              type="number"
              placeholder="Enter value"
              value={currentValue}
              onChange={(e) => handleNumberOrTextChange(e.target.value)}
              onBlur={handleNumberOrTextBlur}
            />
          )}

          {type === "text" && (
            <Input
              type="text"
              placeholder="Enter value"
              value={currentValue}
              onChange={(e) => handleNumberOrTextChange(e.target.value)}
              onBlur={handleNumberOrTextBlur}
            />
          )}
        </div>
      </div>
    </div>
  );
};
