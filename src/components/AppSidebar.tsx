import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Building,
  Info,
  HelpCircle,
  DollarSign,
  ClipboardList,
  Landmark,
  Users,
  Contact,
  MessageSquare,
  Briefcase,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Plus,
  FolderOpen,
  Shield,
  Search,
  Bookmark,
  BarChart3,
  Target,
  FolderKanban,
  Settings,
  Plug,
  FileCheck,
  Inbox,
  CheckSquare,
  Bell,
  ShoppingCart,
  FolderOpen as ProjectsIcon,
  FileStack,
  FileInput,
  Zap,
  BarChart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock projects data
const mockProjects = [
  { id: 1, name: "001 Dennis House" },
  { id: 2, name: "Bondi Beach Renovation" },
  { id: 3, name: "Byron Bay Beach House" },
];

// Portal-level items (shown on dashboard)
const portalItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Ask Trevor", url: "/ask-trevor", icon: Sparkles },
  { title: "Create New Project", url: "/create-project", icon: Plus },
];

const portalCommunicationItems = [
  { title: "Contacts", url: "/contacts", icon: Contact },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Posted Jobs", url: "/posted-tasks", icon: Briefcase },
  { title: "CRM", url: "/crm", icon: BarChart3 },
];

// CRM-specific sidebar items
const crmTopItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, color: "220 70% 50%" },
  { title: "Search", url: "/search", icon: Search, color: "280 65% 60%" },
  { title: "Home", url: "/crm", icon: Home, color: "174 100% 33%" },
  { title: "Inbox", url: "/messages", icon: Inbox, color: "25 95% 53%" },
  { title: "Tasks", url: "/posted-tasks", icon: CheckSquare, color: "142.1 76.2% 36.3%" },
  { title: "Customers", url: "/contacts", icon: Users, color: "197 37% 24%" },
  { title: "Notifications", url: "/notifications", icon: Bell, color: "340 75% 55%" },
];

const crmAppsItems = [
  { title: "CRM", url: "/crm", icon: Target, color: "174 100% 33%" },
  { title: "Sales", url: "/sales", icon: BarChart3, color: "142.1 76.2% 36.3%" },
  { title: "Purchases", url: "/purchases", icon: ShoppingCart, color: "25 95% 53%" },
  { title: "Projects", url: "/dashboard", icon: ProjectsIcon, color: "220 70% 50%" },
  { title: "Files", url: "/documents", icon: FileStack, color: "280 65% 60%" },
  { title: "Forms", url: "/forms", icon: FileInput, color: "197 37% 24%" },
  { title: "Automations", url: "/automations", icon: Zap, color: "43 74% 66%" },
  { title: "Reports", url: "/reports", icon: BarChart, color: "160 60% 45%" },
];

const jobCenterItems = [
  { title: "Find a Job", url: "/find-job", icon: Search },
  { title: "Posted Jobs", url: "/posted-tasks", icon: FileText },
  { title: "Bookmarked Jobs", url: "/bookmarked-projects", icon: Bookmark },
  { title: "Jobs I've Quoted", url: "/quoted-projects", icon: DollarSign },
];

// Project-level items (shown when in a project)
const mainItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Ask Trevor", url: "/ask-trevor", icon: Sparkles },
  { title: "Home", url: "/", icon: Home },
];

const projectItems = [
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Rules", url: "/rules", icon: Building },
  { title: "Project Information", url: "/project-info", icon: Info },
  { title: "Refinement Questions", url: "/refinement", icon: HelpCircle },
];

const financialItems = [
  { title: "Costing", url: "/costing", icon: DollarSign },
  { title: "Planning", url: "/planning", icon: ClipboardList },
  { title: "Approvals and Council", url: "/council", icon: Landmark },
];

const teamItems = [
  { title: "Project Team", url: "/team", icon: Users },
  { title: "Search", url: "/search", icon: Search },
  { title: "Posted Tasks", url: "/posted-tasks?project=001 Dennis House", icon: Briefcase },
  { title: "Shared Project", url: "/shared-project/1", icon: FileText },
  { title: "Contacts", url: "/contacts?project=001 Dennis House", icon: Contact },
  { title: "Messages & Email", url: "/messages?project=001 Dennis House", icon: MessageSquare },
];

const settingsItems = [
  { title: "Members", url: "/members", icon: Users },
  { title: "Security", url: "/security", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const [selectedProject, setSelectedProject] = useState<string>("");
  
  // Check if we're on dashboard (portal level) or in a project
  // For posted-tasks, check if there's a project query parameter
  const searchParams = new URLSearchParams(location.search);
  const hasProjectParam = searchParams.has('project');
  
  const isCRMPage = location.pathname === "/crm";
  
  const isPortalLevel = location.pathname === "/dashboard" || 
                        location.pathname === "/create-project" ||
                        location.pathname === "/find-job" ||
                        location.pathname === "/bookmarked-projects" ||
                        location.pathname === "/quoted-projects" ||
                        location.pathname === "/crm" ||
                        (location.pathname === "/contacts" && !hasProjectParam) ||
                        (location.pathname === "/messages" && !hasProjectParam) ||
                        (location.pathname === "/posted-tasks" && !hasProjectParam) ||
                        location.pathname.startsWith("/company-profile") ||
                        location.pathname.startsWith("/job-view") ||
                        location.pathname.startsWith("/submit-quote");
  
  // Determine the project home URL - default to project 1
  const projectHomeUrl = "/project/1";
  
  const [projectOpen, setProjectOpen] = useState(true);
  const [financialOpen, setFinancialOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [jobCenterOpen, setJobCenterOpen] = useState(true);
  const [crmAppsOpen, setCrmAppsOpen] = useState(true);

  const getNavClass = (url: string) => {
    const isActive = location.pathname === url;
    return isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground";
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    // Navigate to the project home page
    navigate(`/project/${projectId}`);
  };

  const renderMenuItems = (items: typeof mainItems, withColoredIcons = false) => (
    <>
      {items.map((item) => {
        // For Home button in project context, use projectHomeUrl
        const itemUrl = item.title === "Home" && !isPortalLevel ? projectHomeUrl : item.url;
        const itemColor = 'color' in item ? item.color : undefined;
        const isActive = location.pathname === itemUrl;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild className={getNavClass(itemUrl)}>
              <NavLink to={itemUrl} className="flex items-center gap-3">
                {withColoredIcons && itemColor && isActive ? (
                  <div 
                    className="flex items-center justify-center h-8 w-8 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: `hsl(${itemColor})` }}
                  >
                    <item.icon className="h-4 w-4 text-white" />
                  </div>
                ) : (
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                )}
                {!collapsed && <span className="text-base">{item.title}</span>}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );

  return (
    <Sidebar collapsible="icon" className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent>
        {/* Logo/Branding Area */}
        {!collapsed && (
          <div className="px-4 py-6 border-b border-sidebar-border">
            <h2 className="text-xl font-bold text-sidebar-foreground">Ask Trevor</h2>
            <p className="text-xs text-sidebar-foreground/70 mt-1">Project Management</p>
          </div>
        )}

        {/* Project Selector - Only show when NOT on portal level */}
        {!isPortalLevel && !collapsed && (
          <div 
            className="px-6 py-3 border-b border-sidebar-border bg-sidebar-accent/30 cursor-pointer hover:bg-sidebar-accent/50 transition-colors"
            onClick={() => navigate(projectHomeUrl)}
          >
            <p className="text-sm font-bold text-sidebar-foreground/70 mb-2">Project</p>
            <p className="text-base font-bold text-sidebar-foreground">001 Dennis House</p>
          </div>
        )}

        {/* Open Project Selector - Only show when on portal level */}
        {isPortalLevel && !collapsed && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-xs font-medium text-sidebar-foreground/70 mb-2 flex items-center gap-1">
              <FolderOpen className="h-3 w-3" />
              Open Project:
            </p>
            <Select value={selectedProject} onValueChange={handleProjectSelect}>
              <SelectTrigger className="w-full bg-background border-border text-foreground">
                <SelectValue placeholder="Select Project" className="text-foreground" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-[100]">
                {mockProjects.map((project) => (
                  <SelectItem 
                    key={project.id} 
                    value={project.id.toString()}
                    className="cursor-pointer hover:bg-accent text-foreground"
                  >
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Main Items - Show CRM items when on CRM page */}
        {!isCRMPage && (
          <SidebarGroup className="pt-4">
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {renderMenuItems(isPortalLevel ? portalItems : mainItems)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* CRM-specific sections */}
        {isCRMPage && !collapsed && (
          <>
            {/* Top items */}
            <SidebarGroup className="pt-4">
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-2">
                  {renderMenuItems(crmTopItems, true)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Apps Section */}
            <Collapsible open={crmAppsOpen} onOpenChange={setCrmAppsOpen}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full px-4 py-2 flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg mx-2">
                  <SidebarGroupLabel className="text-sidebar-foreground/70 text-sm font-medium normal-case">
                    Apps
                  </SidebarGroupLabel>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      crmAppsOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 px-2">
                      {renderMenuItems(crmAppsItems, true)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </>
        )}

        {/* Project-specific sections - only show when NOT on portal level */}
        {!isPortalLevel && !collapsed && (
          <>
            {/* Project Section - Accordion */}
            <Collapsible open={projectOpen} onOpenChange={setProjectOpen}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full px-6 py-2 flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg">
                  <div className="flex flex-col items-start">
                    <SidebarGroupLabel className="text-sidebar-foreground/90 text-base font-bold normal-case">
                      Project:
                    </SidebarGroupLabel>
                    <span className="text-base text-sidebar-foreground/80 mt-0.5 normal-case font-bold">
                      001 Dennis House
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform flex-shrink-0 ${
                      projectOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <div className="px-6 py-2">
                      <p className="text-base font-bold text-sidebar-foreground/90 normal-case">
                        Project Information
                      </p>
                    </div>
                    <SidebarMenu className="space-y-1 px-2">
                      {renderMenuItems(projectItems)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            {/* Financial Section - Accordion */}
            <Collapsible open={financialOpen} onOpenChange={setFinancialOpen}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full px-6 py-2 flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg">
                  <SidebarGroupLabel className="text-sidebar-foreground/90 text-base font-bold normal-case">
                    Financial & Planning
                  </SidebarGroupLabel>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      financialOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 px-2">
                      {renderMenuItems(financialItems)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            {/* Team Section - Accordion */}
            <Collapsible open={teamOpen} onOpenChange={setTeamOpen}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full px-6 py-2 flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg">
                  <SidebarGroupLabel className="text-sidebar-foreground/90 text-base font-bold normal-case">
                    Team &amp; Quotes
                  </SidebarGroupLabel>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      teamOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 px-2">
                      {renderMenuItems(teamItems)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            {/* Settings Section - Accordion */}
            <Collapsible open={settingsOpen} onOpenChange={setSettingsOpen}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full px-6 py-2 flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg">
                  <SidebarGroupLabel className="text-sidebar-foreground/90 text-base font-bold normal-case">
                    Settings
                  </SidebarGroupLabel>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      settingsOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 px-2">
                      {renderMenuItems(settingsItems)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </>
        )}

        {/* Portal-level communication section */}
        {isPortalLevel && !isCRMPage && !collapsed && (
          <>
            {/* Job Center Section - Accordion */}
            <Collapsible open={jobCenterOpen} onOpenChange={setJobCenterOpen}>
              <SidebarGroup>
                <CollapsibleTrigger className="w-full px-4 py-2 flex items-center justify-between text-sidebar-foreground hover:bg-sidebar-accent/30 rounded-lg mx-2">
                  <SidebarGroupLabel className="text-sidebar-foreground/90 text-base font-semibold normal-case">
                    Job Center
                  </SidebarGroupLabel>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      jobCenterOpen ? "rotate-180" : ""
                    }`}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu className="space-y-1 px-2">
                      {renderMenuItems(jobCenterItems)}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>

            <SidebarGroup>
              <SidebarGroupLabel className="px-6 text-sidebar-foreground/90 text-sm font-semibold">
                Communication
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1 px-2">
                  {renderMenuItems(portalCommunicationItems)}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Collapsed mode for project level - show all items */}
        {!isPortalLevel && collapsed && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1 px-2">
                {renderMenuItems([...projectItems, ...financialItems, ...teamItems, ...settingsItems])}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
