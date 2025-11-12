import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const ProcessGuide = () => {
  const steps = [
    "Receive DA Approval and review conditions",
    "Appoint your PCA (Council or Private) and notify Council",
    "Apply for Section 68 approval (water/sewer/stormwater)",
    "Apply for Section 138 approval (driveway/road reserve)",
    "Prepare and submit structural engineering plans",
    "Lodge CC Application with all supporting documents",
    "Install erosion, sediment, and dust control measures before starting work",
    "Construct in accordance with the CC",
    "Obtain completion certificates (s68, s138, s307, engineering, BASIX)",
    "Apply for the OC through your PCA",
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Step-by-Step Process Summary</CardTitle>
        <CardDescription>
          Follow these steps to progress from DA approval to Occupation Certificate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible defaultValue="process-steps">
          <AccordionItem value="process-steps" className="border-none">
            <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
              View Process Steps
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1.5 pt-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-xs leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};
