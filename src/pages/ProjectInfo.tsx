import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, MessageSquare, RotateCcw, AlertCircle, CheckCircle2, Mic, Edit2, Save, Eye, Download, Pencil, Trash2, Users } from "lucide-react";
import { ProjectInfoAISidebar } from "@/components/ProjectInfoAISidebar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SharedFoldersWidget } from "@/components/SharedFoldersWidget";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

const ProjectInfo = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [projectSummary, setProjectSummary] = useState("Single-storey residential dwelling with modern living areas");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    documentNumber: string;
    documentType: string;
    name: string;
    description: string;
    issueDate: string;
    revisionNumber: string;
    fileType: string;
    size: string;
    uploaded_by: string;
  }>>([
    { 
      id: "1",
      documentNumber: "DH-001-ARH-001",
      documentType: "Architectural",
      name: "Bell_Bird_Cascade_Facade.pdf",
      description: "Main floor plan with elevations",
      issueDate: "2025-10-25",
      revisionNumber: "Rev A",
      fileType: "PDF",
      size: "2.4 MB",
      uploaded_by: "Joshua Dennis"
    }
  ]);
  
  // Original values
  const originalData = {
    ceilingHeight: "2.44 m (Ceiling RL 20.10 m; FFL RL 17.66 m)",
    roofArea: "282.41 m²",
    wallHeight: "2.44 m",
  };

  const handleFieldUpdate = (field: string, value: string) => {
    setEditedFields(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setEditedFields({});
  };

  const getFieldValue = (field: string, originalValue: string) => {
    return editedFields[field] || originalValue;
  };

  const isFieldEdited = (field: string) => {
    return field in editedFields;
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording and transcription
    console.log("Voice recording:", !isRecording);
  };

  const handleSaveSummary = () => {
    setIsEditingSummary(false);
    // TODO: Save summary to database
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getFileIcon = (type: string) => {
    return <FileText className="h-8 w-8 text-red-500" />;
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Project Information</h1>
          <p className="text-muted-foreground text-sm">
            Auto-generated from uploaded plan: Bell Bird – Cascade Facade
          </p>
          
          {/* Project Summary */}
          <div className="mt-4 flex items-center gap-2">
            {isEditingSummary ? (
              <>
                <Input
                  value={projectSummary}
                  onChange={(e) => setProjectSummary(e.target.value)}
                  className="max-w-md"
                  placeholder="Brief project summary..."
                />
                <Button size="sm" onClick={handleSaveSummary}>
                  <Save className="h-3 w-3 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <>
                <p className="text-base font-medium text-primary">{projectSummary}</p>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsEditingSummary(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
        <Button onClick={handleReset} variant="outline" disabled={Object.keys(editedFields).length === 0}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Original
        </Button>
      </div>

      {/* Compliance Summary */}
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-900">
          <strong>Dwelling is Compliant</strong> - All requirements meet R1 General Residential Zone standards. No action items required.
        </AlertDescription>
      </Alert>

      {/* Describe Your Project */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Describe Your Project
          </CardTitle>
          <CardDescription>
            Describe your project and AI will extract key details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="What are you planning to build? Include requirements and features..."
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleVoiceInput} 
              variant={isRecording ? "destructive" : "outline"}
              size="default"
            >
              <Mic className="mr-2 h-4 w-4" />
              {isRecording ? "Stop Recording" : "Voice Input"}
            </Button>
            <Button onClick={() => setIsSidebarOpen(true)} size="default">
              <MessageSquare className="mr-2 h-4 w-4" />
              Ask AI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Document Register */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Control Register
              </CardTitle>
              <CardDescription>
                Upload and manage project plans and documents
              </CardDescription>
            </div>
            <Button size="default" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No documents uploaded yet
            </div>
          ) : (
            <div className="space-y-4">
              {uploadedFiles.map((doc) => (
                <Card key={doc.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-1 flex-shrink-0">
                        {getFileIcon(doc.fileType)}
                      </div>
                      
                      <div className="col-span-11 grid grid-cols-12 gap-3">
                        <div className="col-span-2 min-w-0">
                          <p className="text-sm text-muted-foreground mb-1">Doc Number</p>
                          <p className="font-mono text-base font-medium truncate">{doc.documentNumber}</p>
                        </div>
                        
                        <div className="col-span-2 min-w-0">
                          <p className="text-sm text-muted-foreground mb-1">Type</p>
                          <Badge variant="outline" className="text-sm truncate max-w-full">{doc.documentType}</Badge>
                        </div>
                        
                        <div className="col-span-2 min-w-0">
                          <p className="text-sm text-muted-foreground mb-1">Document Name</p>
                          <p className="font-medium text-base truncate">{doc.name}</p>
                        </div>
                        
                        <div className="col-span-2 min-w-0">
                          <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                          <p className="text-base truncate">{format(new Date(doc.issueDate), "d MMM yyyy")}</p>
                        </div>
                        
                        <div className="col-span-1 min-w-0">
                          <p className="text-sm text-muted-foreground mb-1">Revision</p>
                          <Badge variant="secondary" className="text-sm truncate">{doc.revisionNumber}</Badge>
                        </div>

                        <div className="col-span-1 flex flex-col items-center justify-center gap-1 min-w-0">
                          <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="h-7 w-7 cursor-pointer flex-shrink-0">
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {getInitials(doc.uploaded_by)}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>{doc.uploaded_by}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        <div className="col-span-2 flex gap-1 items-start justify-end flex-shrink-0">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Document</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Download</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Details</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="px-2 text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description row */}
                    <div className="mt-3 ml-[calc(8.333%+1rem)]">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Description:</span> {doc.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* House Overview Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>House Overview</CardTitle>
          <CardDescription>
            <AlertCircle className="inline h-3 w-3 mr-1" />
            This information is auto-generated from the uploaded plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">House Name</TableCell>
                <TableCell>Bell Bird – Cascade Facade</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Drawing Type</TableCell>
                <TableCell>Working Drawing Set (Floor Plan, Elevations, 3D Views)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Designer / Builder</TableCell>
                <TableCell>HPC Group</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Scale</TableCell>
                <TableCell>1 : 100 @ A3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Issue Date</TableCell>
                <TableCell>18 October 2022 (Rev A: 17 January 2022 – Issue for Review)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Storeys</TableCell>
                <TableCell>1 (single-storey dwelling)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Construction</TableCell>
                <TableCell>Concrete slab on ground • Face brick external walls • Colorbond steel roof</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Roof Form & Pitch</TableCell>
                <TableCell>Low-pitch hip roof, 10°–12.5°</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Ceiling Height</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={isFieldEdited("ceilingHeight") ? "bg-yellow-100 px-1 py-0.5 rounded cursor-help" : ""}>
                        {getFieldValue("ceilingHeight", originalData.ceilingHeight)}
                      </span>
                    </TooltipTrigger>
                    {isFieldEdited("ceilingHeight") && (
                      <TooltipContent>
                        <p className="text-xs">Changed by user</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Facade Type</TableCell>
                <TableCell>Cascade – double garage with front porch and hip roofline</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rooms</TableCell>
                <TableCell>4 Bedrooms • 2 Bathrooms • Study • Activities • Living / Kitchen / Dining • Laundry • WIR • Pantry</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">External Features</TableCell>
                <TableCell>Front porch (4.2 m²) • Alfresco (25.15 m²) under main roof</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Windows / Glazing</TableCell>
                <TableCell>17 openings – total 29.7 m² (mix of sliding and awning)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">BASIX Certificate</TableCell>
                <TableCell>1211374S</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Bushfire Classification</TableCell>
                <TableCell>Not stated – likely BAL Low (not bushfire-prone)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Services</TableCell>
                <TableCell>Town water, mains sewer, NBN, hot-water system specified</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Floor Areas</TableCell>
                <TableCell>Living 214.46 m² • Garage 39.74 m² • Alfresco 25.15 m² • Porch 4.20 m² → Total 283.55 m²</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Additional Dimensions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dimensional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Roof Area:</span>{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={isFieldEdited("roofArea") ? "bg-yellow-100 px-1 py-0.5 rounded cursor-help" : ""}>
                      {getFieldValue("roofArea", originalData.roofArea)}
                    </span>
                  </TooltipTrigger>
                  {isFieldEdited("roofArea") && (
                    <TooltipContent>
                      <p className="text-xs">Changed by user</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </p>
              <p className="text-sm"><span className="font-medium">Ceiling Level:</span> RL 20.10 m</p>
              <p className="text-sm"><span className="font-medium">Finished Floor Level:</span> RL 17.66 m</p>
              <p className="text-sm">
                <span className="font-medium">Wall Height:</span>{" "}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={isFieldEdited("wallHeight") ? "bg-yellow-100 px-1 py-0.5 rounded cursor-help" : ""}>
                      {getFieldValue("wallHeight", originalData.wallHeight)}
                    </span>
                  </TooltipTrigger>
                  {isFieldEdited("wallHeight") && (
                    <TooltipContent>
                      <p className="text-xs">Changed by user</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><span className="font-medium">Roof Ridge Height (approx.):</span> ≈ 5.0 m</p>
              <p className="text-sm"><span className="font-medium">Footprint Dimensions:</span> Width ≈ 13.0–14.0 m • Depth ≈ 22.0–23.0 m</p>
              <p className="text-sm"><span className="font-medium">Total Site Coverage:</span> 28.4%</p>
            </div>
          </div>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Compliance Assessment Table */}
      <Card>
        <CardHeader>
          <CardTitle>Dwelling Compliance Assessment</CardTitle>
          <CardDescription>R1 General Residential Zone</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Requirement (R1 Zone)</TableHead>
                <TableHead>Measured / Derived from Plan</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Lot Width</TableCell>
                <TableCell>—</TableCell>
                <TableCell>24.99 m</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Suitable for dwelling width</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lot Depth</TableCell>
                <TableCell>—</TableCell>
                <TableCell>40.00 m</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Suitable for dwelling depth</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Front Setback</TableCell>
                <TableCell>≥ 4.5 m</TableCell>
                <TableCell>~5.0 m (proposed)</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Side Setback (each)</TableCell>
                <TableCell>≥ 0.9 m</TableCell>
                <TableCell>~1.0 m & 1.5 m</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rear Setback</TableCell>
                <TableCell>≥ 4.0 m</TableCell>
                <TableCell>~7.5 m</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Building Height Limit</TableCell>
                <TableCell>≤ 8.5 m</TableCell>
                <TableCell>≈ 5.0 m</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Storey Limit</TableCell>
                <TableCell>Max 2 storeys</TableCell>
                <TableCell>1 storey</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Floor Space Ratio (FSR)</TableCell>
                <TableCell>0.5 : 1 typical</TableCell>
                <TableCell>283.55 / 999.6 = 0.28 : 1</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Site Coverage</TableCell>
                <TableCell>≤ 50 %</TableCell>
                <TableCell>28.4 %</TableCell>
                <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Complies</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Shared Folders Widget */}
      <div className="mb-6">
        <SharedFoldersWidget />
      </div>

      {/* AI Sidebar */}
      <ProjectInfoAISidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        projectContext={projectDescription || "Bell Bird – Cascade Facade project with detailed plans uploaded"}
        onFieldUpdate={handleFieldUpdate}
      />
    </div>
  );
};

export default ProjectInfo;
