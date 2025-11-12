import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Plus, Droplets, Warehouse, Users, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProjectType = 
  | "new-house" 
  | "shed-garage" 
  | "addition" 
  | "renovation" 
  | "pool-deck" 
  | "dual-occupancy" 
  | "other"
  | null;

interface WelcomeSectionProps {
  selectedProjectType: ProjectType;
  onProjectTypeSelect: (type: ProjectType) => void;
}

const projectTypes = [
  {
    id: "new-house" as const,
    icon: Home,
    title: "New House",
    description: "Single dwelling construction",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
    activeBorder: "border-blue-500",
  },
  {
    id: "shed-garage" as const,
    icon: Warehouse,
    title: "Shed/Garage",
    description: "Outbuilding or detached structure",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20",
    activeBorder: "border-amber-500",
  },
  {
    id: "addition" as const,
    icon: Plus,
    title: "Addition/Extension",
    description: "Adding to existing building",
    color: "text-green-500",
    bgColor: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20",
    activeBorder: "border-green-500",
  },
  {
    id: "renovation" as const,
    icon: Wrench,
    title: "Renovation",
    description: "Internal/external modifications",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20",
    activeBorder: "border-purple-500",
  },
  {
    id: "pool-deck" as const,
    icon: Droplets,
    title: "Pool/Deck",
    description: "Swimming pool or deck construction",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20",
    activeBorder: "border-cyan-500",
  },
  {
    id: "dual-occupancy" as const,
    icon: Users,
    title: "Dual Occupancy",
    description: "Two dwellings on one lot",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20",
    activeBorder: "border-rose-500",
  },
  {
    id: "other" as const,
    icon: Building,
    title: "Other",
    description: "Commercial, industrial, or other projects",
    color: "text-slate-500",
    bgColor: "bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/20",
    activeBorder: "border-slate-500",
  },
];

export function WelcomeSection({ selectedProjectType, onProjectTypeSelect }: WelcomeSectionProps) {
  return (
    <Card className="mb-8 border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl mb-2">Welcome to Council Approvals</CardTitle>
        <CardDescription className="text-lg text-base">
          Let's understand your project so we can guide you through the approval process
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">What are you planning to build?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projectTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedProjectType === type.id;
              
              return (
                <button
                  key={type.id}
                  onClick={() => onProjectTypeSelect(type.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                    type.bgColor,
                    isSelected ? type.activeBorder : "border-transparent",
                    isSelected && "ring-2 ring-primary/20 shadow-md"
                  )}
                >
                  <Icon className={cn("h-8 w-8 mb-3", type.color)} />
                  <h4 className="text-lg font-semibold mb-1">{type.title}</h4>
                  <p className="text-base text-muted-foreground">{type.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
