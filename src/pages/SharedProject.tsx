import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Download, 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Calendar,
  Briefcase,
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  Bot,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import SharedProjectAISidebar from "@/components/SharedProjectAISidebar";

type ProjectInfo = {
  id: string;
  name: string;
  description: string;
  address: string;
  location: { lat: number; lng: number };
  type: string;
  created_at: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  start_date: string;
  pricing_model: string;
  tags: string[];
  status: 'open' | 'closed';
};

type Document = {
  id: string;
  name: string;
  file_url: string;
  uploaded_at: string;
  file_size: number;
  mime_type: string;
};

type TeamMember = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  external_role: string;
  permission_level: string;
};

const SharedProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Mock data for demonstration
  const projectInfo: ProjectInfo = {
    id: projectId || "1",
    name: "001 Dennis House",
    description: "A modern 4-bedroom, 3-bathroom family home with open-plan living, high ceilings, and sustainable design features. The property includes a double garage, landscaped gardens, and energy-efficient systems throughout.",
    address: "123 Campbell Parade, Bondi Beach NSW 2026",
    location: { lat: -33.8915, lng: 151.2767 },
    type: "Residential Construction",
    created_at: "2024-10-01T10:00:00",
    contact_person: "Joshua Dennis",
    contact_email: "joshua@example.com",
    contact_phone: "+61 400 123 456",
    start_date: "2025-02-01",
    pricing_model: "fixed_price",
    tags: ["Structural Engineer", "Civil Engineer", "Geotechnical Engineer"],
    status: "open",
  };

  const requirements = [
    "Detailed structural engineering plans and calculations for two-story residential dwelling",
    "Foundation design suitable for coastal soil conditions",
    "Structural framing specifications and load-bearing calculations",
    "Engineer's certification for council submission",
    "Comprehensive timeline and deliverables breakdown",
    "Compliance with Australian Building Standards (AS 1170)",
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
    checkAuth();
    initializeMap();
  }, []);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    // TODO: Add Mapbox token to Supabase secrets
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'; // Demo token

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [projectInfo.location.lng, projectInfo.location.lat],
      zoom: 15,
    });

    // Add marker
    new mapboxgl.Marker()
      .setLngLat([projectInfo.location.lng, projectInfo.location.lat])
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to view this project",
          variant: "destructive",
        });
        // In a real app, redirect to login with return URL
        setIsLoading(false);
        return;
      }

      // Fetch current user's team member info
      const { data: member } = await supabase
        .from("team_members")
        .select("*")
        .eq("user_id", user.id)
        .eq("project_id", projectId)
        .maybeSingle();

      if (member) {
        setCurrentUser(member);
      }

      // Load documents
      setDocuments(mockDocuments);
      setIsLoading(false);
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "client":
        return "bg-blue-500/10 text-blue-700 border-blue-500/20";
      case "builder":
        return "bg-orange-500/10 text-orange-700 border-orange-500/20";
      case "certifier":
        return "bg-purple-500/10 text-purple-700 border-purple-500/20";
      case "consultant":
        return "bg-green-500/10 text-green-700 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    }
  };

  const getPricingModelLabel = (model: string) => {
    switch (model) {
      case "fixed_price":
        return "Fixed Price - Supply and Install";
      case "supply_labor":
        return "Supply Labor Only";
      case "hourly_rate":
        return "Supply Labor at Hourly Rate";
      case "tbd":
        return "To Be Determined";
      default:
        return model;
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark Removed" : "Project Bookmarked",
      description: isBookmarked 
        ? "Project removed from your bookmarks" 
        : "Project added to your bookmarks",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

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
              Back
            </Button>
            <div className="flex items-center gap-2 mb-4">
              <Badge 
                variant={projectInfo.status === 'open' ? 'default' : 'secondary'}
                className="text-base px-4 py-1.5"
              >
                {projectInfo.status === 'open' ? '🟢 Open' : '🔴 Closed'}
              </Badge>
              <Button
                variant="outline"
                onClick={handleBookmark}
                className="gap-2"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4" />
                    Bookmark
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setAiSidebarOpen(true)}
              >
                <Bot className="h-4 w-4 mr-2" />
                AI Assistant
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
                {projectInfo.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
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
                Structural Engineer
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

            {/* Documents Section */}
            <div>
              <h2 className="text-2xl font-bold mb-3">Project Documents</h2>
              <div className="space-y-3">
                {mockDocuments.map((doc) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Project Info & Contact */}
          <div className="space-y-6">
            {/* Project Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span>Start Date</span>
                  </div>
                  <p className="font-medium">
                    {format(new Date(projectInfo.start_date), "MMMM d, yyyy")}
                  </p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Pricing Model</span>
                  </div>
                  <p className="font-medium">
                    {getPricingModelLabel(projectInfo.pricing_model)}
                  </p>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    <span>Posted</span>
                  </div>
                  <p className="font-medium">
                    {format(new Date(projectInfo.created_at), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Person */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Person</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    <span>Name</span>
                  </div>
                  <p className="font-medium">{projectInfo.contact_person}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    <span>Email</span>
                  </div>
                  <a
                    href={`mailto:${projectInfo.contact_email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {projectInfo.contact_email}
                  </a>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" />
                    <span>Phone</span>
                  </div>
                  <a
                    href={`tel:${projectInfo.contact_phone}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {projectInfo.contact_phone}
                  </a>
                </div>

                <Separator className="my-4" />

                {projectInfo.status === 'open' ? (
                  <div className="space-y-2">
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => navigate(`/submit-quote/${projectId}`)}
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Submit a Quote
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      <Phone className="h-4 w-4 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This project is currently closed and not accepting new proposals.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>

      {/* AI Sidebar */}
      <SharedProjectAISidebar
        open={aiSidebarOpen}
        onOpenChange={setAiSidebarOpen}
        projectData={projectInfo}
      />
    </div>
  );
};

export default SharedProject;
