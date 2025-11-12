import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RefinementQuestion } from "@/components/refinement/RefinementQuestion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  key: string;
  label: string;
  options?: string[];
  type?: "radio" | "number" | "text";
  category: string;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
}

const mockTeamMembers: TeamMember[] = [
  { id: "1", full_name: "Joshua Dennis", email: "joshua@example.com" },
  { id: "2", full_name: "Sarah Johnson", email: "sarah@example.com" },
  { id: "3", full_name: "Mike Williams", email: "mike@example.com" },
  { id: "4", full_name: "Emma Davis", email: "emma@example.com" },
  { id: "5", full_name: "John Certifier", email: "john@certify.com" },
  { id: "6", full_name: "Lisa Consultant", email: "lisa@consult.com" },
];

const QUESTIONS: Question[] = [
  // Site Conditions
  { key: "landSlope", label: "Land Slope", options: ["Flat", "Gentle", "Moderate", "Steep"], category: "Site Conditions" },
  { key: "soilClassification", label: "Soil Classification", options: ["A", "S", "M", "H1", "H2", "E", "P"], category: "Site Conditions" },
  { key: "cutFillRequired", label: "Cut & Fill Required?", options: ["Yes", "No"], category: "Site Conditions" },
  { key: "cutFillVolume", label: "Cut & Fill Volume (m³)", type: "number", category: "Site Conditions" },
  { key: "retainingWalls", label: "Retaining Walls Required?", options: ["Yes", "No"], category: "Site Conditions" },
  { key: "averageSiteFall", label: "Average Site Fall (m)", type: "number", category: "Site Conditions" },
  
  // Building & Structure
  { key: "ceilingHeight", label: "Ceiling Height", options: ["2.4m", "2.55m", "2.7m", "3.0m"], category: "Building & Structure" },
  { key: "wallConstruction", label: "Wall Construction", options: ["Brick Veneer", "Double Brick", "Hebel"], category: "Building & Structure" },
  { key: "roofType", label: "Roof Type", options: ["Hip", "Gable", "Skillion", "Flat"], category: "Building & Structure" },
  
  // Internal Finishes
  { key: "finishLevel", label: "Level of Finish", options: ["Basic", "Standard", "Premium", "Luxury"], category: "Internal Finishes" },
  { key: "mainLivingFlooring", label: "Main Living Flooring", options: ["Tiles", "Vinyl", "Timber", "Polished Concrete"], category: "Internal Finishes" },
  { key: "bedroomFlooring", label: "Bedroom Flooring", options: ["Carpet", "Vinyl", "Timber"], category: "Internal Finishes" },
  { key: "wetAreaFinishes", label: "Wet Area Finishes", options: ["Standard", "Full Height", "Feature Tile"], category: "Internal Finishes" },
  { key: "kitchenBenchtop", label: "Kitchen Benchtop", options: ["Laminate", "20mm Stone", "40mm Stone"], category: "Internal Finishes" },
  
  // Services & Sustainability
  { key: "airConditioning", label: "Air Conditioning", options: ["None", "Split", "Ducted", "Multi-zone"], category: "Services & Sustainability" },
  { key: "solarPV", label: "Solar PV System", options: ["Yes", "No"], category: "Services & Sustainability" },
  { key: "solarPVSize", label: "Solar PV Size (kW)", type: "number", category: "Services & Sustainability" },
  { key: "batteryStorage", label: "Battery Storage", options: ["Yes", "No"], category: "Services & Sustainability" },
  { key: "batteryCapacity", label: "Battery Capacity (kWh)", type: "number", category: "Services & Sustainability" },
  { key: "evCharger", label: "EV Charger", options: ["Yes", "No"], category: "Services & Sustainability" },
  { key: "hotWaterSystem", label: "Hot Water System", options: ["Electric", "Gas", "Heat Pump", "Solar"], category: "Services & Sustainability" },
  
  // External Works
  { key: "drivewayMaterial", label: "Driveway Material", options: ["Concrete", "Exposed Aggregate", "Pavers", "Asphalt"], category: "External Works" },
  { key: "drivewayArea", label: "Driveway Area (m²)", type: "number", category: "External Works" },
  { key: "fencing", label: "Fencing Required", options: ["Yes", "No"], category: "External Works" },
  { key: "fencingType", label: "Fencing Type", options: ["Colorbond", "Timber", "Masonry", "Pool"], category: "External Works" },
  { key: "fencingLength", label: "Fencing Length (m)", type: "number", category: "External Works" },
  { key: "landscapingAllowance", label: "Landscaping Allowance", options: ["Basic", "Moderate", "Full"], category: "External Works" },
];

const Refinement = () => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("outstanding");

  const handleSave = (questionKey: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionKey]: value }));
    setCompletedQuestions((prev) => new Set([...prev, questionKey]));
    toast({
      title: "Answer saved",
      description: "Your response has been recorded",
    });
  };

  const handleEdit = (questionKey: string) => {
    setCompletedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionKey);
      return newSet;
    });
    setActiveTab("outstanding");
  };

  const handleAssignChange = (questionKey: string, memberId: string) => {
    setAssignments((prev) => ({ ...prev, [questionKey]: memberId }));
    const member = mockTeamMembers.find(m => m.id === memberId);
    toast({
      title: "Question assigned",
      description: member ? `Assigned to ${member.full_name}` : "Assignment updated",
    });
  };

  const categories = Array.from(new Set(QUESTIONS.map((q) => q.category)));
  const totalQuestions = QUESTIONS.length;
  const completedCount = completedQuestions.size;
  const progressPercentage = Math.round((completedCount / totalQuestions) * 100);

  const outstandingQuestions = QUESTIONS.filter((q) => !completedQuestions.has(q.key));
  const completedQuestionsList = QUESTIONS.filter((q) => completedQuestions.has(q.key));

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">🧠 Refinement Questions</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Providing these details helps Trevor fine-tune your cost estimate. By completing these
          quick questions, you'll improve accuracy and give a clearer picture of your project.
        </p>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Progress: {completedCount} of {totalQuestions} answered
          </span>
          {progressPercentage === 100 && (
            <Badge variant="default" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Complete
            </Badge>
          )}
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="outstanding" className="text-xs sm:text-sm">
            Outstanding ({outstandingQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            Completed ({completedCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="outstanding" className="space-y-4">
          {outstandingQuestions.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">All Questions Answered!</h3>
              <p className="text-muted-foreground">
                You've completed all refinement questions. Your cost estimate is now optimized.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {categories.map((category) => {
                const categoryQuestions = outstandingQuestions.filter(
                  (q) => q.category === category
                );
                if (categoryQuestions.length === 0) return null;

                return (
                  <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      {category} ({categoryQuestions.length})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {categoryQuestions.map((question) => {
                        const questionNumber = outstandingQuestions.findIndex(q => q.key === question.key) + 1;
                        return (
                          <RefinementQuestion
                            key={question.key}
                            questionNumber={questionNumber}
                            questionKey={question.key}
                            label={question.label}
                            options={question.options}
                            type={question.type}
                            value={answers[question.key]}
                            assignedTo={assignments[question.key]}
                            teamMembers={mockTeamMembers}
                            onAssignChange={(memberId) => handleAssignChange(question.key, memberId)}
                            onSave={(value) => handleSave(question.key, value)}
                          />
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedQuestionsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No completed questions yet. Start answering questions in the Outstanding tab.
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {categories.map((category) => {
                const categoryQuestions = completedQuestionsList.filter(
                  (q) => q.category === category
                );
                if (categoryQuestions.length === 0) return null;

                return (
                  <AccordionItem key={category} value={category} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      {category} ({categoryQuestions.length})
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {categoryQuestions.map((question) => {
                        const questionNumber = QUESTIONS.findIndex(q => q.key === question.key) + 1;
                        return (
                          <RefinementQuestion
                            key={question.key}
                            questionNumber={questionNumber}
                            questionKey={question.key}
                            label={question.label}
                            value={answers[question.key]}
                            assignedTo={assignments[question.key]}
                            teamMembers={mockTeamMembers}
                            isCompleted={true}
                            onEdit={() => handleEdit(question.key)}
                            onSave={() => {}}
                          />
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Refinement;
