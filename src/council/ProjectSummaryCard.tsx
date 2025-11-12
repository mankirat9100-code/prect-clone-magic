import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, XCircle, Clock, Pencil } from "lucide-react";

interface ProjectSummaryCardProps {
  projectType: string | null;
  hasDaApproval: boolean | null;
  certifierChoice: string | null;
  hasPlans: boolean | null;
  hasBuilder: boolean | null;
  onEdit: () => void;
}

const projectTypeLabels: Record<string, string> = {
  "new-house": "New House",
  "shed-garage": "Shed/Garage",
  "addition": "Addition/Extension",
  "renovation": "Renovation",
  "pool-deck": "Pool/Deck",
  "dual-occupancy": "Dual Occupancy",
  "other": "Other Project"
};

export function ProjectSummaryCard({
  projectType,
  hasDaApproval,
  certifierChoice,
  hasPlans,
  hasBuilder,
  onEdit
}: ProjectSummaryCardProps) {
  const getStatusIcon = (status: boolean | null) => {
    if (status === true) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = (status: boolean | null, yesText: string, noText: string) => {
    if (status === true) return yesText;
    if (status === false) return noText;
    return "Not specified";
  };

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Project Summary</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Project Type</p>
            <Badge variant="secondary" className="text-base">
              {projectType ? projectTypeLabels[projectType] : "Not selected"}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">DA Approval Status</p>
            <div className="flex items-center gap-2">
              {getStatusIcon(hasDaApproval)}
              <span className="text-base">
                {getStatusText(hasDaApproval, "Approved", "Not yet approved")}
              </span>
            </div>
          </div>

          {certifierChoice && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Certifier</p>
              <span className="text-base capitalize">{certifierChoice}</span>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Construction Plans</p>
            <div className="flex items-center gap-2">
              {getStatusIcon(hasPlans)}
              <span className="text-base">
                {getStatusText(hasPlans, "Ready", "In progress")}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Builder</p>
            <div className="flex items-center gap-2">
              {getStatusIcon(hasBuilder)}
              <span className="text-base">
                {getStatusText(hasBuilder, "Engaged", "Not yet engaged")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
