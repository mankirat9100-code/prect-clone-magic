import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, Upload, CheckSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import React from "react";

interface ComplianceItem {
  condition: string;
  requirement: string;
  status: "completed" | "pending" | "required";
  whenDue: string;
  responsibleParty: string;
  evidence: string;
  phase: "Before CC" | "During Construction" | "Before OC" | "After Completion";
}

interface ComplianceChecklistProps {
  items: ComplianceItem[];
  onStatusToggle?: (index: number) => void;
  onResponsiblePartyChange?: (index: number, party: string) => void;
  title?: string;
  daInfo?: {
    number: string;
    description: string;
    council: string;
    dateOfDetermination: string;
    consentLapses: string;
  };
  showSuperseded?: boolean;
  superseded?: boolean;
  onSupersededChange?: (superseded: boolean) => void;
}

export const ComplianceChecklist = ({ 
  items, 
  onStatusToggle, 
  onResponsiblePartyChange,
  title = "Detailed Requirements from Development Application Approval",
  daInfo = {
    number: "2022/343 – Single Dwelling & Swimming Pool",
    description: "Single Dwelling & Swimming Pool",
    council: "Port Macquarie–Hastings Council",
    dateOfDetermination: "23 June 2022",
    consentLapses: "23 June 2027 (5 years from the date of determination)"
  },
  showSuperseded = false,
  superseded = false,
  onSupersededChange
}: ComplianceChecklistProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "required":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    if (superseded) {
      return <Badge className="bg-muted text-muted-foreground">Not Required</Badge>;
    }
    
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">Pending</Badge>;
      case "required":
        return <Badge className="bg-red-500/10 text-red-700 hover:bg-red-500/20">Required</Badge>;
      default:
        return null;
    }
  };

  const phaseOrder: Array<"Before CC" | "During Construction" | "Before OC" | "After Completion"> = 
    ["Before CC", "During Construction", "Before OC", "After Completion"];
  
  const phaseLabels: Record<"Before CC" | "During Construction" | "Before OC" | "After Completion", string> = {
    "Before CC": "Before Construction Certificate (CC)",
    "During Construction": "During Construction",
    "Before OC": "Before Occupation Certificate (OC)",
    "After Completion": "After Completion"
  };
  
  const groupedItems = phaseOrder.map(phase => ({
    phase,
    items: items.filter(item => item.phase === phase)
  })).filter(group => group.items.length > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Complete checklist of all conditions, timing, and required documentation
            </CardDescription>
          </div>
          {showSuperseded && (
            <div className="flex items-center gap-2 ml-4">
              <Checkbox
                id="superseded"
                checked={superseded}
                onCheckedChange={(checked) => onSupersededChange?.(checked as boolean)}
              />
              <label
                htmlFor="superseded"
                className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Superseded by modification
              </label>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            <div>
              <span className="font-medium">Development Application (DA) No:</span>{" "}
              <span className="text-muted-foreground">{daInfo.number}</span>
            </div>
            <div>
              <span className="font-medium">Council:</span>{" "}
              <span className="text-muted-foreground">{daInfo.council}</span>
            </div>
            <div>
              <span className="font-medium">Date of Determination (DA Approval):</span>{" "}
              <span className="text-muted-foreground">{daInfo.dateOfDetermination}</span>
            </div>
            <div>
              <span className="font-medium">Consent Lapses:</span>{" "}
              <span className="text-muted-foreground">{daInfo.consentLapses}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="conditions-table">
          <AccordionItem value="conditions-table" className="border-none">
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
              View Compliance Conditions
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto pt-2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold">Done</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Condition</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Requirement</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Who</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Evidence / Upload</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedItems.map((group) => (
                      <React.Fragment key={group.phase}>
                        {/* Phase Header Row */}
                        <tr className="bg-primary/5 border-b-2 border-primary/20">
                          <td colSpan={6} className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <CheckSquare className="h-5 w-5 text-primary" />
                              <span className="font-semibold text-base text-primary">
                                {phaseLabels[group.phase]}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* Items in this phase */}
                        {group.items.map((item) => {
                          const originalIndex = items.findIndex(i => i === item);
                          return (
                            <tr
                              key={originalIndex}
                              className="border-b hover:bg-accent/50 transition-colors"
                            >
                              <td className="px-4 py-4">
                                <Checkbox
                                  checked={item.status === "completed"}
                                  onCheckedChange={() => onStatusToggle?.(originalIndex)}
                                />
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(item.status)}
                                  <span className="font-medium text-sm">{item.condition}</span>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm">{item.requirement}</p>
                              </td>
                              <td className="px-4 py-4">
                                <Select
                                  value={item.responsibleParty}
                                  onValueChange={(value) => onResponsiblePartyChange?.(originalIndex, value)}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select party" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Builder">Builder</SelectItem>
                                    <SelectItem value="Owner">Owner</SelectItem>
                                    <SelectItem value="Certifier">Certifier</SelectItem>
                                    <SelectItem value="Engineer">Engineer</SelectItem>
                                    <SelectItem value="Plumber">Plumber</SelectItem>
                                    <SelectItem value="Designer">Designer</SelectItem>
                                    <SelectItem value="PCA">PCA</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                              </td>
                              <td className="px-4 py-4">
                                <p className="text-sm text-muted-foreground">{item.evidence}</p>
                              </td>
                              <td className="px-4 py-4">
                                {getStatusBadge(item.status)}
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
