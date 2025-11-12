import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  MapPin, 
  ArrowLeft,
  Bot,
  Trash2,
  Save,
  Upload,
  CheckCircle2
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SharedProjectAISidebar from "@/components/SharedProjectAISidebar";

type Document = {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
};

const EditTask = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [taskTitle, setTaskTitle] = useState("Building Designer Needed");
  const [taskDescription, setTaskDescription] = useState("Proposed two bedroom addition with modern kitchen and living area");
  const [briefContent, setBriefContent] = useState("We are seeking an experienced Building Designer for our residential project in Bondi Beach. The project involves designing a two-bedroom addition with a modern kitchen and open-plan living area.\n\nKey Requirements:\n- Detailed architectural plans\n- 3D renderings\n- Council submission documentation\n- Energy efficiency compliance\n\nTimeline: 6-8 weeks\nBudget: $15,000 - $20,000");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Mock project and task info
  const projectInfo = {
    id: "1",
    name: "001 Dennis House",
    description: "A modern 4-bedroom, 3-bathroom family home with open-plan living, high ceilings, and sustainable design features. The property includes a double garage, landscaped gardens, and energy-efficient systems throughout.",
    address: "123 Campbell Parade, Bondi Beach NSW 2026",
    location: { lat: -33.8915, lng: 151.2767 },
    type: "Residential Construction",
  };

  const requirements = [
    "Detailed architectural plans and elevations",
    "3D renderings and visualizations",
    "Council submission documentation package",
    "Energy efficiency compliance reports",
    "Material specifications and selections",
    "Construction timeline and methodology",
  ];

  const mockDocuments: Document[] = [
    {
      id: "1",
      name: "Development_Application_Plans.pdf",
      file_url: "#",
      uploaded_at: "2024-10-15T10:30:00",
      file_size: 5242880,
      mime_type: "application/pdf",
    },
    {
      id: "2",
      name: "Construction_Certificate_Plans.pdf",
      file_url: "#",
      uploaded_at: "2024-10-18T14:15:00",
      file_size: 4194304,
      mime_type: "application/pdf",
    },
    {
      id: "3",
      name: "Architectural_Drawings_Set.pdf",
      file_url: "#",
      uploaded_at: "2024-10-20T09:45:00",
      file_size: 8388608,
      mime_type: "application/pdf",
    },
    {
      id: "4",
      name: "Site_Survey_Report.pdf",
      file_url: "#",
      uploaded_at: "2024-10-12T11:20:00",
      file_size: 2097152,
      mime_type: "application/pdf",
    },
  ];

  useEffect(() => {
    setDocuments(mockDocuments);
    initializeMap();
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

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

  const handleRemoveDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
    toast({
      title: "Document Removed",
      description: "Document will not be included in the task",
    });
  };

  const handleSaveTask = () => {
    toast({
      title: "Task Updated",
      description: "Your posted task has been updated successfully",
    });
    setIsEditing(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const newDocs: Document[] = Array.from(files).map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        name: file.name,
        file_url: URL.createObjectURL(file),
        uploaded_at: new Date().toISOString(),
        file_size: file.size,
        mime_type: file.type,
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
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Posted Tasks
            </Button>
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="outline"
                onClick={() => setAiSidebarOpen(true)}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
              <Button
                onClick={handleSaveTask}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
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
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border shadow-sm">
              <div ref={mapContainer} className="h-[300px] w-full" />
            </div>

            {/* Task Details */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Task Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">Task Title</label>
                  <Input
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="text-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Task Description</label>
                  <Textarea
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
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
                Building Designer
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
                <h2 className="text-2xl font-bold">Task Brief</h2>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    Edit Brief
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    Preview
                  </Button>
                )}
              </div>
              {isEditing ? (
                <Textarea
                  value={briefContent}
                  onChange={(e) => setBriefContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              ) : (
                <Card className="p-6">
                  <div className="whitespace-pre-wrap text-muted-foreground">
                    {briefContent || "No brief content available."}
                  </div>
                </Card>
              )}
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
                Manage the documents attached to this task posting.
              </p>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.name}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>
                            {format(new Date(doc.uploaded_at), "MMM d, yyyy")}
                          </span>
                          <span>{formatFileSize(doc.file_size)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-shrink-0 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveDocument(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Task Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Task Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline">Open</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Posted Date</p>
                  <p className="font-medium">2 days ago</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Responses</p>
                  <p className="font-medium">8 responses</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Category</p>
                  <p className="font-medium">Design</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5">
              <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use the AI Assistant to help refine and improve your task posting.
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
          taskTitle: taskTitle,
          brief: briefContent,
        }}
      />
    </div>
  );
};

export default EditTask;
