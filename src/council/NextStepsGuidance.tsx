import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight, FileText, Users, Building2, Search, Upload, CheckCircle2 } from "lucide-react";
import { ProjectType } from "./WelcomeSection";
import { StageAssessmentAnswers } from "./StageAssessment";
import { useNavigate } from "react-router-dom";

interface NextStepsGuidanceProps {
  projectType: ProjectType;
  stageAnswers: StageAssessmentAnswers;
}

export function NextStepsGuidance({ projectType, stageAnswers }: NextStepsGuidanceProps) {
  const navigate = useNavigate();

  // Determine what guidance to show based on stage
  const showDaGuidance = stageAnswers.hasDaApproval === false;
  const showCertifierGuidance = stageAnswers.hasDaApproval === true && stageAnswers.hasCertifier === false;
  const showConstructionGuidance = stageAnswers.hasDaApproval === true && stageAnswers.hasCertifier === true;
  const hasDaApproval = stageAnswers.hasDaApproval === true;

  if (!projectType) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Congratulations Card - Show when they have DA approval */}
      {hasDaApproval && (
        <Card className="border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-500/5 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl mb-3">Congratulations!</CardTitle>
            <CardDescription className="text-lg">
              You're a good way through the process with your DA approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-background rounded-lg p-6 border-2 border-green-500/30">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ArrowRight className="h-6 w-6 text-green-500" />
                Next Steps for You
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-base font-bold text-green-600">1</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Upload your DA approval documents</p>
                    <p className="text-base text-muted-foreground">
                      Upload your Development Approval and any council correspondence so we can extract the specific conditions and requirements for your project
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-base font-bold text-green-600">2</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">Select a Principal Certifying Authority (PCA)</p>
                    <p className="text-base text-muted-foreground">
                      Choose between Council or a Private Certifier to issue your Construction Certificate
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-base font-bold text-green-600">3</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold mb-1">We'll help you track compliance</p>
                    <p className="text-base text-muted-foreground">
                      Once uploaded, we'll show you exactly what needs to be done and help you find consultants to complete requirements
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                className="w-full gap-3 h-14 text-lg font-semibold" 
                size="lg"
                onClick={() => {
                  document.getElementById("document-upload")?.click();
                }}
              >
                <Upload className="h-5 w-5" />
                Upload Your DA Approval Documents Now
              </Button>
              <p className="text-center text-base text-muted-foreground">
                Accepted formats: PDF, Word documents, images (JPG, PNG)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DA Approval Guidance */}
      {showDaGuidance && (
        <Card className="border-2 border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-xl">Getting Your DA Approval</CardTitle>
            </div>
            <CardDescription>
              Before you can get a Construction Certificate, you'll need Development Application approval
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                What is a Development Application (DA)?
              </h4>
              <p className="text-base text-muted-foreground">
                A DA is a formal application to your local council for permission to undertake development. 
                It ensures your project complies with planning controls, zoning, and environmental requirements.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Steps to prepare a DA:</h4>
              <ol className="list-decimal list-inside space-y-2 text-base text-muted-foreground">
                <li>Engage a designer/architect to create concept plans</li>
                <li>Conduct required studies (BASIX, bushfire, flood, etc.)</li>
                <li>Prepare DA documentation with all supporting reports</li>
                <li>Lodge DA with Port Macquarie-Hastings Council</li>
                <li>Respond to any council requests for additional information</li>
                <li>Receive DA approval (typically 6-12 weeks)</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Find consultants to help with your DA:
              </h4>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/search?role=architect")}
                  className="gap-2"
                >
                  <Search className="h-3 w-3" />
                  Architects
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/search?role=designer")}
                  className="gap-2"
                >
                  <Search className="h-3 w-3" />
                  Designers
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/search?role=town-planner")}
                  className="gap-2"
                >
                  <Search className="h-3 w-3" />
                  Town Planners
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate("/search?role=surveyor")}
                  className="gap-2"
                >
                  <Search className="h-3 w-3" />
                  Surveyors
                </Button>
              </div>
            </div>

            <div className="p-4 bg-background rounded-lg border">
              <p className="text-base font-medium mb-2">Estimated Timeline & Costs:</p>
              <ul className="text-base text-muted-foreground space-y-1">
                <li>• DA preparation: 4-8 weeks</li>
                <li>• Council assessment: 6-12 weeks</li>
                <li>• DA fees: $2,000 - $5,000+ (varies by project)</li>
                <li>• Consultant fees: $5,000 - $20,000+ (varies by complexity)</li>
              </ul>
            </div>

            <Button className="w-full gap-2 h-12 text-base" size="lg">
              <ArrowRight className="h-5 w-5" />
              Learn More About DA Process
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Certifier Guidance */}
      {showCertifierGuidance && (
        <Card className="border-2 border-blue-500/30 bg-blue-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-xl">Next Step: Appoint a Certifier</CardTitle>
            </div>
            <CardDescription>
              Now that you have DA approval, you need to appoint a Principal Certifying Authority (PCA)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Why you need a certifier:</h4>
              <p className="text-base text-muted-foreground">
                A PCA is required before you can get a Construction Certificate. They will review your plans, 
                issue the CC, conduct mandatory inspections during construction, and issue your Occupation Certificate.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-semibold">You have two options:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-lg border">
                  <p className="text-lg font-medium mb-2">Council Certifier</p>
                  <p className="text-base text-muted-foreground mb-3">
                    Port Macquarie-Hastings Council can act as your PCA
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-base"
                    onClick={() => window.open("https://www.pmhc.nsw.gov.au/Services/Building-and-Development/Certifiers", "_blank")}
                  >
                    Visit Council Website
                  </Button>
                </div>
                <div className="p-4 bg-background rounded-lg border">
                  <p className="text-lg font-medium mb-2">Private Certifier</p>
                  <p className="text-base text-muted-foreground mb-3">
                    Independent certifiers often offer faster service
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 text-base"
                    onClick={() => navigate("/search?role=certifier")}
                  >
                    Find Private Certifiers
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Construction Phase Guidance */}
      {showConstructionGuidance && (
        <Card className="border-2 border-green-500/30 bg-green-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-500" />
              <CardTitle className="text-xl">Ready for Construction Certificate</CardTitle>
            </div>
            <CardDescription>
              You're on track! Upload your DA approval documents to see your specific compliance requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base text-muted-foreground mb-4">
              Once you upload your DA approval, we'll extract the specific conditions and requirements 
              for your project and help you track compliance throughout the construction process.
            </p>
            <Button className="w-full gap-2 h-12 text-base" size="lg" onClick={() => {
              document.getElementById("document-upload")?.click();
            }}>
              <FileText className="h-5 w-5" />
              Upload DA Approval Documents
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
