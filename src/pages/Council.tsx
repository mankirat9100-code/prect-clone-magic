import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Printer, Bot, Upload } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceChecklist } from "@/components/council/ComplianceChecklist";
import { CouncilAISidebar } from "@/components/council/CouncilAISidebar";
import { ProcessGuide } from "@/components/council/ProcessGuide";
import { InfoCards } from "@/components/council/InfoCards";
import { DocumentList, DocumentTag, UploadedDocument } from "@/components/council/DocumentList";
import { useToast } from "@/hooks/use-toast";
import { WelcomeSection, ProjectType } from "@/components/council/WelcomeSection";
import { StageAssessment, StageAssessmentAnswers } from "@/components/council/StageAssessment";
import { NextStepsGuidance } from "@/components/council/NextStepsGuidance";
import { ProjectSummaryCard } from "@/components/council/ProjectSummaryCard";
import { supabase } from "@/integrations/supabase/client";

const Council = () => {
  const { toast } = useToast();
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isSuperseded, setIsSuperseded] = useState(false);
  const [councilProjectId, setCouncilProjectId] = useState<string | null>(null);
  const [isLoadingProject, setIsLoadingProject] = useState(true);
  const [certifierChoice, setCertifierChoice] = useState<string | null>(null);
  
  // New state for welcome flow
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(null);
  const [stageAnswers, setStageAnswers] = useState<StageAssessmentAnswers>({
    hasDaApproval: null,
    hasConstructionPlans: null,
    hasCertifier: null,
    hasBuilder: null,
  });
  
  type ComplianceItem = {
    condition: string;
    requirement: string;
    status: "completed" | "pending" | "required";
    whenDue: string;
    responsibleParty: string;
    evidence: string;
    phase: "Before CC" | "During Construction" | "Before OC" | "After Completion";
  };
  
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([
    {
      condition: "A002",
      requirement: "Appoint a PCA and notify Council",
      status: "required",
      whenDue: "Before CC",
      responsibleParty: "Owner / Builder",
      evidence: "PCA appointment form + Council notice",
      phase: "Before CC",
    },
    {
      condition: "A045",
      requirement: "Apply and pay for water meter connection",
      status: "required",
      whenDue: "Before CC",
      responsibleParty: "Owner / Builder",
      evidence: "Council application + receipt",
      phase: "Before CC",
    },
    {
      condition: "B001",
      requirement: "Obtain Section 68 approval (water/sewer/stormwater) with plan",
      status: "pending",
      whenDue: "Before CC",
      responsibleParty: "Plumber / Designer",
      evidence: "S68 approval + plan",
      phase: "Before CC",
    },
    {
      condition: "B006",
      requirement: "Obtain Section 138 approval for driveway and footpath works",
      status: "pending",
      whenDue: "Before CC",
      responsibleParty: "Owner / Builder",
      evidence: "S138 approval letter",
      phase: "Before CC",
    },
    {
      condition: "Engineering",
      requirement: "Provide structural engineering drawings and certification for footings, slabs, and retaining walls",
      status: "required",
      whenDue: "Before CC",
      responsibleParty: "Structural Engineer",
      evidence: "Certified plans + engineer's certificate",
      phase: "Before CC",
    },
    {
      condition: "A009",
      requirement: "Install and maintain erosion and dust controls",
      status: "pending",
      whenDue: "Before & during works",
      responsibleParty: "Builder",
      evidence: "Photos / PCA notes",
      phase: "During Construction",
    },
    {
      condition: "D015-D017",
      requirement: "Pool fencing and signage must be approved before filling pool",
      status: "pending",
      whenDue: "During build",
      responsibleParty: "Builder / PCA",
      evidence: "Inspection report",
      phase: "During Construction",
    },
    {
      condition: "E034",
      requirement: "Provide Council confirmation that Section 138 works are complete",
      status: "pending",
      whenDue: "Before OC",
      responsibleParty: "Builder / Owner",
      evidence: "Council completion letter",
      phase: "Before OC",
    },
    {
      condition: "E051",
      requirement: "Provide Section 68 completion certificate",
      status: "pending",
      whenDue: "Before OC",
      responsibleParty: "Plumber / Owner",
      evidence: "Council certificate",
      phase: "Before OC",
    },
    {
      condition: "E056",
      requirement: "Engineer certification letter - Certifies footing/piers near sewer built per plans",
      status: "pending",
      whenDue: "Before OC",
      responsibleParty: "Structural Engineer",
      evidence: "Engineer certification letter",
      phase: "Before OC",
    },
    {
      condition: "E057",
      requirement: "Provide Section 307 Certificate of Compliance (final water/sewer)",
      status: "pending",
      whenDue: "Before OC",
      responsibleParty: "Plumber / Owner",
      evidence: "Council certificate",
      phase: "Before OC",
    },
    {
      condition: "E058",
      requirement: "Provide BASIX completion confirmation to PCA",
      status: "pending",
      whenDue: "Before OC",
      responsibleParty: "Builder / Owner",
      evidence: "Signed BASIX checklist",
      phase: "Before OC",
    },
    {
      condition: "E001",
      requirement: "Apply for Occupation Certificate",
      status: "pending",
      whenDue: "After completion",
      responsibleParty: "PCA / Owner",
      evidence: "Final OC document",
      phase: "After Completion",
    },
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newDocuments: UploadedDocument[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      uploadedAt: new Date(),
    }));

    setUploadedDocuments((prev) => [...prev, ...newDocuments]);
    toast({
      title: "Documents uploaded",
      description: `${files.length} document(s) uploaded successfully. Please tag each document.`,
    });
  };

  const handleDocumentTagChange = (documentId: string, tag: DocumentTag) => {
    setUploadedDocuments((prev) =>
      prev.map((doc) => (doc.id === documentId ? { ...doc, tag } : doc))
    );
  };

  const handleDocumentDelete = (documentId: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    toast({
      title: "Document removed",
      description: "Document has been removed from the list.",
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleStatusToggle = (index: number) => {
    setComplianceItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              status: (item.status === "completed" ? "required" : "completed") as "completed" | "pending" | "required",
            }
          : item
      )
    );
  };

  const handleResponsiblePartyChange = (index: number, party: string) => {
    setComplianceItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, responsibleParty: party } : item
      )
    );
  };

  const handleStageAnswerChange = async (field: keyof StageAssessmentAnswers, value: any) => {
    setStageAnswers((prev) => ({ ...prev, [field]: value }));
    
    // Save to database - don't save hasCertifier since it's derived from certifier_choice
    if (councilProjectId && field !== 'hasCertifier') {
      const dbField = field === 'hasDaApproval' ? 'has_da_approval' : 
                      field === 'hasConstructionPlans' ? 'has_plans' :
                      'has_builder';
      
      let dbValue = value;
      if (field === 'hasConstructionPlans') {
        // Convert tri-state to boolean
        dbValue = value === 'yes' ? true : value === 'no' ? false : null;
      }
      
      await saveProjectData({ [dbField]: dbValue });
    }
  };

  // Load council project data
  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoadingProject(false);
          return;
        }

        const { data, error } = await supabase
          .from('council_projects')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading project:', error);
          setIsLoadingProject(false);
          return;
        }

        if (data) {
          setCouncilProjectId(data.id);
          setSelectedProjectType(data.project_type as ProjectType);
          setCertifierChoice(data.certifier_choice);
          setStageAnswers({
            hasDaApproval: data.has_da_approval,
            hasConstructionPlans: data.has_plans === null ? null : data.has_plans ? 'yes' : 'no',
            hasCertifier: data.certifier_choice ? true : data.certifier_choice === null ? null : false,
            hasBuilder: data.has_builder,
          });
        }
      } catch (error) {
        console.error('Error loading project:', error);
      } finally {
        setIsLoadingProject(false);
      }
    };

    loadProjectData();
  }, []);

  // Save project data to database
  const saveProjectData = async (updates: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (councilProjectId) {
        // Update existing
        const { error } = await supabase
          .from('council_projects')
          .update(updates)
          .eq('id', councilProjectId);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('council_projects')
          .insert({
            user_id: user.id,
            ...updates
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setCouncilProjectId(data.id);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Error saving project",
        description: "Failed to save your project data. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Handle project type selection
  const handleProjectTypeSelect = async (type: ProjectType) => {
    setSelectedProjectType(type);
    await saveProjectData({ project_type: type });
  };

  // Handle edit - reset to welcome flow
  const handleEditProject = () => {
    setSelectedProjectType(null);
    setCertifierChoice(null);
    setStageAnswers({
      hasDaApproval: null,
      hasConstructionPlans: null,
      hasCertifier: null,
      hasBuilder: null,
    });
    setCouncilProjectId(null);
  };

  // Show project summary when project type is selected
  const showProjectSummary = !isLoadingProject && !!selectedProjectType;
  // Show welcome flow only when no documents uploaded and no project type selected
  const showWelcomeFlow = !isLoadingProject && uploadedDocuments.length === 0 && !selectedProjectType;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Hidden file input - always present for upload functionality */}
        <input
          id="document-upload"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Council Approvals</h1>
            <p className="text-muted-foreground text-lg">
              {showProjectSummary && selectedProjectType
                ? `You're building a ${selectedProjectType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Track compliance requirements for your Construction Certificate`
                : showWelcomeFlow 
                ? "Start by telling us about your project"
                : "Track compliance requirements for your Construction Certificate"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handlePrintReport} variant="outline" size="lg" className="h-12 text-base px-6">
              <Printer className="mr-2 h-5 w-5" />
              Print Report
            </Button>
            <Button onClick={() => setIsAISidebarOpen(true)} size="lg" className="h-12 text-base px-6">
              <Bot className="mr-2 h-5 w-5" />
              Ask AI Assistant
            </Button>
          </div>
        </div>

        {/* Project Summary - Show when project exists */}
        {showProjectSummary && (
          <ProjectSummaryCard
            projectType={selectedProjectType}
            hasDaApproval={stageAnswers.hasDaApproval}
            certifierChoice={certifierChoice}
            hasPlans={stageAnswers.hasConstructionPlans === 'yes' ? true : stageAnswers.hasConstructionPlans === 'no' ? false : null}
            hasBuilder={stageAnswers.hasBuilder}
            onEdit={handleEditProject}
          />
        )}

        {/* Welcome Flow - Only show when no project summary exists */}
        {showWelcomeFlow && (
          <>
            {!selectedProjectType && (
              <WelcomeSection
                selectedProjectType={selectedProjectType}
                onProjectTypeSelect={handleProjectTypeSelect}
              />
            )}
            
            {selectedProjectType && (
              <>
                <StageAssessment
                  answers={stageAnswers}
                  onAnswerChange={handleStageAnswerChange}
                />
                
                <NextStepsGuidance
                  projectType={selectedProjectType}
                  stageAnswers={stageAnswers}
                />

                {/* Show InfoCards if user needs certifier information */}
                {stageAnswers.hasDaApproval === true && stageAnswers.hasCertifier === false && (
                  <InfoCards />
                )}

                {/* Show ProcessGuide during initial setup */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Understanding the Full Process</h2>
                  <ProcessGuide />
                </div>
              </>
            )}
          </>
        )}

        {/* Document Register and Compliance - Always visible */}
        <>
          {/* Document Register Section */}
          <div className="mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Document Register</CardTitle>
                      <CardDescription>
                        All compliance documents for your DA and CC
                      </CardDescription>
                    </div>
                    <label htmlFor="document-upload">
                      <Button variant="outline" className="gap-2" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4" />
                          Upload Documents
                        </span>
                      </Button>
                    </label>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Dummy Document */}
                    <Card className="hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <div className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-1 flex-shrink-0">
                            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          
                          <div className="col-span-11 grid grid-cols-12 gap-3">
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Doc Number</p>
                              <p className="font-mono text-base font-medium truncate">DH-001-CNC-001</p>
                            </div>
                            
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Type</p>
                              <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 truncate max-w-full">
                                Council
                              </span>
                            </div>
                            
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Document Name</p>
                              <p className="font-medium text-base truncate">DA Approval Notice 2022/343</p>
                            </div>
                            
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                              <p className="text-base truncate">23 Jun 2022</p>
                            </div>
                            
                            <div className="col-span-1 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Revision</p>
                              <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-semibold text-secondary-foreground truncate">
                                Rev A
                              </span>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-center gap-1 min-w-0">
                              <svg className="h-3 w-3 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                                JD
                              </div>
                            </div>
                            
                            <div className="col-span-2 flex gap-1 items-start justify-end flex-shrink-0">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="px-2"
                              >
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Uploaded Documents */}
                    {uploadedDocuments.map((doc) => (
                      <Card key={doc.id} className="hover:shadow-md transition-all">
                        <CardContent className="p-5">
                          <div className="grid grid-cols-12 gap-4 items-start">
                            <div className="col-span-1 flex-shrink-0">
                              <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            
                            <div className="col-span-11 grid grid-cols-12 gap-3">
                              <div className="col-span-2 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Doc Number</p>
                                <p className="font-mono text-base font-medium truncate">-</p>
                              </div>
                              
                              <div className="col-span-2 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Type</p>
                                {doc.tag && (
                                  <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 truncate max-w-full">
                                    {doc.tag}
                                  </span>
                                )}
                              </div>
                              
                              <div className="col-span-2 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Document Name</p>
                                <p className="font-medium text-base truncate">{doc.name}</p>
                              </div>
                              
                              <div className="col-span-2 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Upload Date</p>
                                <p className="text-base truncate">{new Date(doc.uploadedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              
                              <div className="col-span-1 min-w-0">
                                <p className="text-sm text-muted-foreground mb-1">Revision</p>
                                <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-sm font-semibold text-secondary-foreground truncate">
                                  -
                                </span>
                              </div>

                              <div className="col-span-1 flex flex-col items-center justify-center gap-1 min-w-0">
                                <svg className="h-3 w-3 text-muted-foreground flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium flex-shrink-0">
                                  U
                                </div>
                              </div>
                              
                              <div className="col-span-2 flex gap-1 items-start justify-end flex-shrink-0">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2"
                                  onClick={() => handleDocumentDelete(doc.id)}
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2"
                                >
                                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Cards - Show when project summary exists */}
            {showProjectSummary && <InfoCards />}

            {/* Process Guide - Show when project summary exists */}
            {showProjectSummary && (
              <div className="mb-8">
                <ProcessGuide />
              </div>
            )}

            {/* Compliance Checklist - Original DA */}
            <div className="mb-8">
              <ComplianceChecklist 
                items={complianceItems} 
                onStatusToggle={handleStatusToggle}
                onResponsiblePartyChange={handleResponsiblePartyChange}
                showSuperseded={true}
                superseded={isSuperseded}
                onSupersededChange={setIsSuperseded}
              />
            </div>

            {/* Compliance Checklist - DA Modification */}
            <ComplianceChecklist 
              items={complianceItems}
              onStatusToggle={handleStatusToggle}
              onResponsiblePartyChange={handleResponsiblePartyChange}
              title="Detailed Requirements from Development Application Modification"
              daInfo={{
                number: "2023/045 MOD 1 – Single Dwelling & Swimming Pool",
                description: "Modification to original DA",
                council: "Port Macquarie–Hastings Council",
                dateOfDetermination: "15 March 2023",
                consentLapses: "23 June 2027 (linked to original consent)"
              }}
            />
        </>

        {/* AI Sidebar */}
        <CouncilAISidebar
          isOpen={isAISidebarOpen}
          onClose={() => setIsAISidebarOpen(false)}
          projectContext="Council CDC Certifier - helping clients understand and comply with DA conditions"
          uploadedDocuments={uploadedDocuments}
        />
      </div>
    </div>
  );
};

export default Council;
