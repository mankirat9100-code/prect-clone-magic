import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  MessageSquare,
  CheckSquare,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  ChevronRight,
  Home as HomeIcon,
  Plus,
  Briefcase,
  Bookmark,
  FileText,
  Search,
  Sparkles,
  Eye,
  Bell,
} from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { SharedFoldersWidget } from "@/components/SharedFoldersWidget";

// Mock project data
const mockProjects = [
  {
    id: 1,
    name: "001 Dennis House",
    address: "24 Harvest Street, Thrumster, NSW",
    coordinates: [152.8655, -31.4333], // Port Macquarie area
    status: "In Progress",
    progress: 45,
    budget: 850000,
    spent: 380000,
    stage: "DA and CC Application",
    team: 8,
    tasks: 23,
    tasksCompleted: 10,
    lastUpdate: "2 hours ago",
  },
  {
    id: 2,
    name: "Bondi Beach Renovation",
    address: "15 Campbell Parade, Bondi Beach, NSW",
    coordinates: [151.2743, -33.8908],
    status: "Planning",
    progress: 15,
    budget: 1200000,
    spent: 180000,
    stage: "Concept & Design",
    team: 6,
    tasks: 15,
    tasksCompleted: 2,
    lastUpdate: "1 day ago",
  },
  {
    id: 3,
    name: "Byron Bay Beach House",
    address: "88 Lighthouse Road, Byron Bay, NSW",
    coordinates: [153.6123, -28.6436],
    status: "Construction",
    progress: 78,
    budget: 950000,
    spent: 741000,
    stage: "Construction",
    team: 12,
    tasks: 45,
    tasksCompleted: 35,
    lastUpdate: "3 hours ago",
  },
];

// Project Item Component
const ProjectItem = ({ project, onClick }: { project: typeof mockProjects[0]; onClick: () => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-all">
      {/* Collapsed View */}
      <div
        className="p-4 cursor-pointer flex items-center justify-between hover:bg-accent/30"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1">{project.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {project.address}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
            <Badge
              variant={
                project.status === "Construction"
                  ? "default"
                  : project.status === "In Progress"
                  ? "secondary"
                  : "outline"
              }
            >
              {project.stage}
            </Badge>
          </div>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded View */}
      {expanded && (
        <div className="px-4 pb-4 border-t bg-accent/10">
          <div className="grid grid-cols-2 gap-4 mt-4 mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Team</p>
              <p className="text-base font-medium flex items-center gap-1">
                <Users className="h-3 w-3" />
                {project.team} members
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-base font-medium">
                ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasks</p>
              <p className="text-base font-medium">
                {project.tasksCompleted}/{project.tasks} complete
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline">{project.status}</Badge>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-base">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            <span className="text-sm text-muted-foreground">
              Updated {project.lastUpdate}
            </span>
            <Button
              variant="default"
              size="sm"
              className="gap-1"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              Open Project
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const mockMessages = [
  {
    id: 1,
    project: "001 Dennis House",
    from: "John Smith - Engineer",
    message: "Structural plans approved and ready for submission",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 2,
    project: "Byron Bay Beach House",
    from: "Sarah Johnson - Builder",
    message: "Framing inspection scheduled for tomorrow",
    time: "3 hours ago",
    unread: true,
  },
  {
    id: 3,
    project: "Bondi Beach Renovation",
    from: "Mike Williams - Designer",
    message: "New design concepts attached for review",
    time: "5 hours ago",
    unread: false,
  },
];

const mockTasks = [
  {
    id: 1,
    project: "001 Dennis House",
    task: "Submit Construction Certificate application",
    dueDate: "Today",
    priority: "High",
    status: "Pending",
    completed: false,
  },
  {
    id: 2,
    project: "Byron Bay Beach House",
    task: "Schedule final plumbing inspection",
    dueDate: "Tomorrow",
    priority: "High",
    status: "Pending",
    completed: false,
  },
  {
    id: 3,
    project: "Bondi Beach Renovation",
    task: "Review and approve architectural drawings",
    dueDate: "In 2 days",
    priority: "Medium",
    status: "In Progress",
    completed: false,
  },
  {
    id: 4,
    project: "001 Dennis House",
    task: "Finalize material selections",
    dueDate: "In 3 days",
    priority: "Medium",
    status: "Pending",
    completed: false,
  },
];

const mockPotentialJobs = [
  {
    id: 1,
    title: "Structural Engineering Services",
    project: "Multi-Storey Residential Building",
    location: "Parramatta, NSW",
    budget: "$25,000 - $35,000",
    postedDate: "2 days ago",
    matchScore: 95,
  },
  {
    id: 2,
    title: "Building Design Package",
    project: "Coastal House Extension",
    location: "Coffs Harbour, NSW",
    budget: "$15,000 - $20,000",
    postedDate: "3 days ago",
    matchScore: 88,
  },
  {
    id: 3,
    title: "Construction Management",
    project: "Commercial Fit-Out",
    location: "Sydney CBD, NSW",
    budget: "$40,000 - $50,000",
    postedDate: "5 days ago",
    matchScore: 82,
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [mapInitialized, setMapInitialized] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [tasks, setTasks] = useState(mockTasks);
  const [userName, setUserName] = useState("Joshua");
  const [businessName, setBusinessName] = useState("Dennis Partners");
  const [contextType, setContextType] = useState<"individual" | "business">("business");

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        const firstName = profile.full_name.split(" ")[0];
        setUserName(firstName);
      }

      // Fetch user context
      const { data: context } = await supabase
        .from("user_context")
        .select("context_type, business_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (context) {
        setContextType(context.context_type as "individual" | "business");

        // If business context, fetch business name
        if (context.context_type === "business" && context.business_id) {
          const { data: business } = await supabase
            .from("business_profiles")
            .select("business_name")
            .eq("id", context.business_id)
            .maybeSingle();

          if (business?.business_name) {
            setBusinessName(business.business_name);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
  const overallProgress = Math.round(
    mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length
  );
  const unreadMessages = mockMessages.filter((m) => m.unread).length;
  const pendingTasks = mockTasks.filter((t) => t.status === "Pending").length;

  const initializeMap = (token: string) => {
    if (!mapContainer.current || map.current) return;

    // Validate Mapbox token format
    if (!token || token.trim().length < 20 || !token.startsWith('pk.')) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid Mapbox public token (starts with 'pk.')",
        variant: "destructive",
      });
      return;
    }

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [151.2093, -33.8688], // Sydney center
      zoom: 6,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add markers for each project
    mockProjects.forEach((project) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.backgroundColor = "#8B5CF6";
      el.style.width = "30px";
      el.style.height = "30px";
      el.style.borderRadius = "50%";
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      const marker = new mapboxgl.Marker(el)
        .setLngLat(project.coordinates as [number, number])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="padding: 8px;">
              <h3 style="margin: 0 0 4px 0; font-weight: 600;">${project.name}</h3>
              <p style="margin: 0; font-size: 12px; color: #666;">${project.address}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px;"><strong>Stage:</strong> ${project.stage}</p>
            </div>`
          )
        )
        .addTo(map.current!);

      el.addEventListener("click", () => {
        navigate(`/project/${project.id}`);
      });
    });

    setMapInitialized(true);
  };

  useEffect(() => {
    if (mapboxToken && !mapInitialized) {
      initializeMap(mapboxToken);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-[1600px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {userName}. Here's a list of your {contextType === "business" ? `${businessName} ` : ""}projects
          </p>
        </div>

        {/* Key Metrics - Smaller Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h2 className="text-xs font-medium">Active Projects</h2>
              <HomeIcon className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{mockProjects.length}</div>
              <p className="text-sm text-muted-foreground">{overallProgress}% avg completion</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h2 className="text-xs font-medium">Messages</h2>
              <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{mockMessages.length}</div>
              <p className="text-sm text-muted-foreground">{unreadMessages} unread</p>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h2 className="text-xs font-medium">Tasks Due</h2>
              <CheckSquare className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{mockTasks.length}</div>
              <p className="text-sm text-muted-foreground">{pendingTasks} pending</p>
            </CardContent>
          </Card>

          <Card 
            className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => navigate("/refinement")}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h2 className="text-xs font-medium">Refinement Questions</h2>
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">25</div>
              <div className="flex items-center gap-1">
                <Badge variant="destructive" className="text-xs">Important</Badge>
                <span className="text-sm text-muted-foreground">outstanding</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Tasks - Full Width */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Upcoming Tasks
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate("/planning")}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-base font-medium flex-1">{task.task}</p>
                      <Badge
                        variant={task.priority === "High" ? "destructive" : "secondary"}
                        className="text-xs ml-2"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="text-primary underline font-medium">{task.project}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={task.completed ? "secondary" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setTasks(tasks.map(t => 
                        t.id === task.id ? { ...t, completed: !t.completed } : t
                      ));
                      toast({
                        title: task.completed ? "Task marked as incomplete" : "Task completed",
                        description: task.task,
                      });
                    }}
                    className="shrink-0"
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate("/planning")}
            >
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Map Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Project Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!mapInitialized && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Enter your Mapbox Public Token to view project locations on the map.
                  Get your token from{" "}
                  <a
                    href="https://mapbox.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    mapbox.com
                  </a>
                </p>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder="pk.eyJ1..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    className="max-w-md"
                  />
                  <Button 
                    onClick={() => initializeMap(mapboxToken)}
                    disabled={!mapboxToken || mapboxToken.trim().length < 20 || !mapboxToken.startsWith('pk.')}
                  >
                    Load Map
                  </Button>
                </div>
              </div>
            )}
            <div
              ref={mapContainer}
              className="h-[400px] rounded-lg border bg-muted"
              style={{ display: mapInitialized ? "block" : "none" }}
            />
            {!mapInitialized && (
              <div className="h-[400px] rounded-lg border bg-muted flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Enter token to load map</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects and Jobs - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Your Projects - Half Width */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Projects</CardTitle>
              <Button onClick={() => setCreateProjectOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockProjects.map((project) => (
                <ProjectItem
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/project/${project.id}`)}
                />
              ))}
            </CardContent>
          </Card>

          {/* New Potential Jobs - Half Width */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                New Potential Jobs
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-matched projects based on your profile
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockPotentialJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-base font-medium mb-1">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.project}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {job.matchScore}% match
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      {job.budget}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {job.postedDate}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/job-view/${job.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
              <Button
                variant="default"
                className="w-full gap-2"
                onClick={() => navigate("/find-job")}
              >
                <Search className="h-4 w-4" />
                Browse All Jobs
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Updates Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Updates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SharedFoldersWidget />
          </CardContent>
        </Card>

        {/* Bottom Row - Communication and Job Center */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* All Communication - Wider (2 columns) */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                All Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer ${
                      message.unread ? "bg-primary/5 border-primary/20" : ""
                    }`}
                    onClick={() => navigate("/messages")}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.from.split(" ")[0][0]}
                          {message.from.split(" ")[1][0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{message.from}</p>
                        <p className="text-sm text-primary underline font-medium">{message.project}</p>
                      </div>
                      {message.unread && (
                        <Badge variant="destructive" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{message.time}</p>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => navigate("/messages")}
              >
                Open Full Messages
              </Button>
            </CardContent>
          </Card>

          {/* Job Center */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/find-job')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find a Job
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/posted-tasks')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Posted Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/bookmarked-projects')}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmarked Jobs
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm"
                  onClick={() => navigate('/quoted-projects')}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Jobs I've Quoted
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <CreateProjectDialog 
        open={createProjectOpen} 
        onOpenChange={setCreateProjectOpen} 
      />
    </div>
  );
};

export default Dashboard;
