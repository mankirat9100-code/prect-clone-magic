import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  FileText, 
  Download, 
  MapPin, 
  ArrowLeft,
  Bot,
  Trash2,
  Save,
  Upload,
  CheckCircle2,
  Eye,
  Users,
  CheckCheck
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SharedProjectAISidebar from "@/components/SharedProjectAISidebar";
import { BriefAIAssistant } from "@/components/BriefAIAssistant";

type Document = {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  revision_number?: number;
};

const DraftBrief = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, brief, projectId } = location.state || {};
  
  const [briefContent, setBriefContent] = useState(brief || "");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [aiBottomOpen, setAiBottomOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Mock project info - in production this would come from the database
  const projectInfo = {
    id: projectId || "1",
    name: "Dennis Partners House",
    description: "A modern 4-bedroom, 3-bathroom family home with open-plan living, high ceilings, and sustainable design features. The property includes a double garage, landscaped gardens, and energy-efficient systems throughout.",
    address: "123 Campbell Parade, Bondi Beach NSW 2026",
    location: { lat: -33.8915, lng: 151.2767 },
    type: "Residential Construction",
  };

  const requirements = [
    "Detailed structural engineering plans and calculations for two-story residential dwelling",
    "Foundation design suitable for coastal soil conditions",
    "Structural framing specifications and load-bearing calculations",
    "Engineer's certification for council submission",
    "Comprehensive timeline and deliverables breakdown",
    "Compliance with Australian Building Standards (AS 1170)",
  ];

  // All council plans attached by default
  const mockDocuments: Document[] = [
    {
      id: "1",
      name: "Development_Application_Plans.pdf",
      file_url: "#",
      uploaded_at: "2024-10-15T10:30:00",
      file_size: 5242880,
      mime_type: "application/pdf",
      uploaded_by: "Sarah Mitchell",
      revision_number: 2,
    },
    {
      id: "2",
      name: "Construction_Certificate_Plans.pdf",
      file_url: "#",
      uploaded_at: "2024-10-18T14:15:00",
      file_size: 4194304,
      mime_type: "application/pdf",
      uploaded_by: "John Smith",
      revision_number: 1,
    },
    {
      id: "3",
      name: "Architectural_Drawings_Set.pdf",
      file_url: "#",
      uploaded_at: "2024-10-20T09:45:00",
      file_size: 8388608,
      mime_type: "application/pdf",
      uploaded_by: "Sarah Mitchell",
      revision_number: 3,
    },
    {
      id: "4",
      name: "Site_Survey_Report.pdf",
      file_url: "#",
      uploaded_at: "2024-10-12T11:20:00",
      file_size: 2097152,
      mime_type: "application/pdf",
      uploaded_by: "Mike Johnson",
      revision_number: 1,
    },
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
    initializeMap();
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'; // Demo token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [projectInfo.location.lng, projectInfo.location.lat],
      zoom: 15,
    });

    new mapboxgl.Marker()
      .setLngLat([projectInfo.location.lng, projectInfo.location.lat])
      .addTo(map.current);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getInitials = (name: string) => {
    const names = name.split(" ");
    return names.length > 1
      ? names[0][0] + names[1][0]
      : names[0].substring(0, 2);
  };

  const handleRemoveDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast({
      title: "Document Removed",
      description: "Document will not be included in the brief",
    });
  };

  const handleSaveBrief = () => {
    toast({
      title: "Brief Saved",
      description: "Your draft brief has been saved successfully",
    });
    setIsEditing(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // In production, upload to Supabase Storage
      // For now, just add to the documents list
      const newDocs: Document[] = Array.from(files).map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: file.name,
        file_url: URL.createObjectURL(file),
        uploaded_at: new Date().toISOString(),
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: "Current User",
        revision_number: 1,
      }));

      setDocuments([...documents, ...newDocs]);
      
      toast({
        title: "Documents Uploaded",
        description: `${files.length} document(s) added successfully`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold">Project Brief for {role}</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setAiSidebarOpen(true)}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Approve Brief
              </Button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div>
              <h1 className="text-4xl font-bold mb-3">{projectInfo.name}</h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <MapPin className="h-4 w-4" />
                <span>{projectInfo.address}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="bg-primary/10">
                  {projectInfo.type}
                </Badge>
                <Badge variant="secondary">
                  {role}
                </Badge>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <div ref={mapContainer} className="h-[300px] w-full" />
            </div>

            {/* Project Overview */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Project Overview</h2>
              <p className="text-muted-foreground leading-relaxed">
                {projectInfo.description}
              </p>
            </div>

            {/* Skills We Require */}
            <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
              <h2 className="text-2xl font-bold mb-3">Skills We Require</h2>
              <Badge variant="default" className="text-base px-3 py-1">
                {role}
              </Badge>
            </div>

            {/* What We Need From You */}
            <div>
              <h2 className="text-2xl font-bold mb-3">What We Need From You</h2>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brief Content */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold">Brief for {role}</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setAiBottomOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Bot className="h-4 w-4" />
                    AI Assistant
                  </Button>
                  {!isEditing ? (
                    <>
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Brief
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white gap-2"
                      >
                        <CheckCheck className="h-4 w-4" />
                        Approve
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleSaveBrief} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
              {isEditing ? (
                <div className="space-y-2">
                  {/* Formatting Toolbar */}
                  <div className="flex gap-2 p-2 border rounded-lg bg-muted/50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('brief-textarea') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const newText = text.substring(0, start) + '\n• ' + text.substring(end);
                          setBriefContent(newText);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + 3, start + 3);
                          }, 0);
                        }
                      }}
                    >
                      • Add Bullet Point
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('brief-textarea') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const selectedText = text.substring(start, end);
                          const newText = text.substring(0, start) + '**' + selectedText + '**' + text.substring(end);
                          setBriefContent(newText);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + 2, end + 2);
                          }, 0);
                        }
                      }}
                    >
                      <strong>B</strong> Bold
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textarea = document.getElementById('brief-textarea') as HTMLTextAreaElement;
                        if (textarea) {
                          const start = textarea.selectionStart;
                          const end = textarea.selectionEnd;
                          const text = textarea.value;
                          const newText = text.substring(0, start) + '\n\n## Section Heading\n' + text.substring(end);
                          setBriefContent(newText);
                          setTimeout(() => {
                            textarea.focus();
                            textarea.setSelectionRange(start + 4, start + 19);
                          }, 0);
                        }
                      }}
                    >
                      Add Heading
                    </Button>
                  </div>
                  <Textarea
                    id="brief-textarea"
                    value={briefContent}
                    onChange={(e) => setBriefContent(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter your brief here. Use • for bullet points, **text** for bold, and ## for headings."
                  />
                </div>
              ) : (
                <Card className="p-6">
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {briefContent || "No brief content available."}
                  </div>
                </Card>
              )}

              {/* AI Assistant for Brief */}
              <BriefAIAssistant
                open={aiBottomOpen}
                onOpenChange={setAiBottomOpen}
                briefContent={briefContent}
                onApplyChanges={(newContent) => setBriefContent(newContent)}
              />
            </div>

            {/* Documents Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold">Attached Documents</h2>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  variant="outline"
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.dwg,.png,.jpg,.jpeg"
              />
              <p className="text-sm text-muted-foreground mb-4">
                All council plans are attached by default. Remove documents you don't want to include or upload additional ones.
              </p>
              
              {/* Document Register Header */}
              <div className="grid grid-cols-12 gap-2 px-4 pb-2 text-xs font-medium text-muted-foreground border-b">
                <div className="col-span-4">Document Name</div>
                <div className="col-span-2 text-center">Date</div>
                <div className="col-span-1 text-center">Size</div>
                <div className="col-span-1 text-center">Rev</div>
                <div className="col-span-1 flex justify-center">
                  <Users className="h-3 w-3" />
                </div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {/* Document Register Rows */}
              <div className="space-y-2 mt-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="grid grid-cols-12 gap-2 items-center p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    {/* Document Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{doc.name}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 text-center">
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(doc.uploaded_at), "dd/MM/yyyy")}
                      </p>
                    </div>

                    {/* Size */}
                    <div className="col-span-1 text-center">
                      <p className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</p>
                    </div>

                    {/* Revision */}
                    <div className="col-span-1 flex justify-center">
                      <Badge variant="secondary" className="text-xs">{doc.revision_number || 1}</Badge>
                    </div>

                    {/* Uploaded By */}
                    <div className="col-span-1 flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="h-7 w-7 cursor-pointer">
                              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                {getInitials(doc.uploaded_by || "Unknown")}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>{doc.uploaded_by || "Unknown"}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex gap-1 justify-end">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Document</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveDocument(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Project Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Brief Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Role</p>
                  <p className="font-medium">{role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Project</p>
                  <p className="font-medium">{projectInfo.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use the AI Assistant to help refine and improve your brief.
              </p>
              <Button 
                onClick={() => setAiSidebarOpen(true)}
                className="w-full"
              >
                <Bot className="h-4 w-4 mr-2" />
                Open AI Assistant
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* AI Assistant Sidebar */}
      <SharedProjectAISidebar
        open={aiSidebarOpen}
        onOpenChange={setAiSidebarOpen}
        projectData={{
          name: projectInfo.name,
          role: role,
          brief: briefContent,
        }}
      />
    </div>
  );
};

export default DraftBrief;
