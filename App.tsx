import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, MessageSquare, User as UserIcon, Settings, Gift, HelpCircle, LogOut, UserCircle } from "lucide-react";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CreateProject from "./pages/CreateProject";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import AskTrevor from "./pages/AskTrevor";
import Documents from "./pages/Documents";
import NewDocument from "./pages/NewDocument";
import DocumentEditor from "./pages/DocumentEditor";
import Rules from "./pages/Rules";
import ProjectInfo from "./pages/ProjectInfo";
import Refinement from "./pages/Refinement";
import Costing from "./pages/Costing";
import Planning from "./pages/Planning";
import Council from "./pages/Council";
import Team from "./pages/Team";
import Members from "./pages/Members";
import Contacts from "./pages/Contacts";
import CRM from "./pages/CRM"; 
import PostedTasks from "./pages/PostedTasks";
import TaskResponses from "./pages/TaskResponses";
import ConsultantProfile from "./pages/ConsultantProfile";
import JobView from "./pages/JobView";
import DraftBrief from "./pages/DraftBrief";
import EditTask from "./pages/EditTask";
import Profile from "./pages/Profile";
import Security from "./pages/Security";
import SharedProject from "./pages/SharedProject";
import SubmitQuote from "./pages/SubmitQuote";
import FindJob from "./pages/FindJob";
import BookmarkedProjects from "./pages/BookmarkedProjects";
import QuotedProjects from "./pages/QuotedProjects";
import CompanyProfile from "./pages/CompanyProfile";
import Search from "./pages/Search";
import ProtectedRoute from "./components/ProtectedRoute";
import { mockMessageThreads } from "./data/messageData";

const queryClient = new QueryClient();

const AppHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicRoute = ['/', '/auth'].includes(location.pathname);

  // ALL hooks MUST be called before any conditional returns
  const unreadCount = mockMessageThreads.reduce((sum, thread) => sum + thread.unreadCount, 0);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [displayName, setDisplayName] = useState("JD");
  const [fullName, setFullName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");

  // Check if we're on portal level or project level
  const searchParams = new URLSearchParams(location.search);
  const hasProjectParam = searchParams.has('project');
  
  const isPortalLevel = location.pathname === "/dashboard" || 
                        location.pathname === "/create-project" ||
                        location.pathname === "/find-job" ||
                        location.pathname === "/bookmarked-projects" ||
                        location.pathname === "/quoted-projects" ||
                        (location.pathname === "/contacts" && !hasProjectParam) ||
                        (location.pathname === "/messages" && !hasProjectParam) ||
                        (location.pathname === "/posted-tasks" && !hasProjectParam) ||
                        location.pathname.startsWith("/company-profile") ||
                        location.pathname.startsWith("/job-view") ||
                        location.pathname.startsWith("/submit-quote");

  const projectHomeUrl = "/project/1";

  const fetchUserContext = async (userId: string) => {
    try {
      // Fetch user context
      const { data: context } = await supabase
        .from("user_context")
        .select("context_type, business_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (context?.context_type === "business" && context.business_id) {
        // Show business name
        const { data: business } = await supabase
          .from("business_profiles")
          .select("business_name, business_email")
          .eq("id", context.business_id)
          .maybeSingle();

        if (business) {
          setFullName(business.business_name || "Business");
          setEmail(business.business_email || "");
          setDisplayName(business.business_name?.substring(0, 2).toUpperCase() || "BP");
        }
      } else {
        // Show personal name
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", userId)
          .maybeSingle();

        if (profile) {
          setFullName(profile.full_name || "User");
          setEmail(profile.email || "");
          const names = profile.full_name?.split(" ") || ["U"];
          setDisplayName(
            names.length > 1
              ? names[0][0] + names[1][0]
              : names[0].substring(0, 2)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching user context:", error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user context when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchUserContext(session.user.id);
          }, 0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserContext(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Don't render header on public routes (AFTER all hooks)
  if (isPublicRoute) {
    return null;
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      setUser(null);
      setSession(null);
      toast.success("Logged out successfully");
      navigate("/auth");
    }
  };

  return (
    <header className="h-14 border-b bg-card flex items-center px-2 sm:px-4 sticky top-0 z-header shadow-sm">
      <div className="flex items-center gap-1 sm:gap-2">
        <SidebarTrigger />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(isPortalLevel ? '/dashboard' : projectHomeUrl)}
          className="gap-1 sm:gap-2"
        >
          <Home className="h-4 w-4" />
          <span className="font-medium hidden sm:inline">Home</span>
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-3">
        {/* Messages Icon */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/messages')}
          className="relative"
        >
          <MessageSquare className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {displayName}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card z-50">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              Personal Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/company-profile/current')}>
              <UserCircle className="mr-2 h-4 w-4" />
              Company Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/account-settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/referral-program')}>
              <Gift className="mr-2 h-4 w-4" />
              Referral Program
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/help-center')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

const ConditionalSidebar = () => {
  const location = useLocation();
  const isPublicRoute = ['/', '/auth'].includes(location.pathname);
  
  if (isPublicRoute) {
    return null;
  }
  
  return <AppSidebar />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full overflow-hidden">
            <ConditionalSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <AppHeader />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/project/:projectId" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                  <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
                  <Route path="/ask-trevor" element={<AskTrevor />} />
                  <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
                  <Route path="/documents/new" element={<ProtectedRoute><NewDocument /></ProtectedRoute>} />
                  <Route path="/documents/editor/:documentType" element={<ProtectedRoute><DocumentEditor /></ProtectedRoute>} />
                  <Route path="/rules" element={<ProtectedRoute><Rules /></ProtectedRoute>} />
                  <Route path="/project-info" element={<ProtectedRoute><ProjectInfo /></ProtectedRoute>} />
                  <Route path="/refinement" element={<ProtectedRoute><Refinement /></ProtectedRoute>} />
                  <Route path="/costing" element={<ProtectedRoute><Costing /></ProtectedRoute>} />
                  <Route path="/planning" element={<ProtectedRoute><Planning /></ProtectedRoute>} />
                  <Route path="/council" element={<ProtectedRoute><Council /></ProtectedRoute>} />
                  <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
                  <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
                  <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
                  <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
                  <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                  <Route path="/posted-tasks" element={<ProtectedRoute><PostedTasks /></ProtectedRoute>} />
                  <Route path="/task-responses/:taskId" element={<ProtectedRoute><TaskResponses /></ProtectedRoute>} />
                  <Route path="/consultant-profile/:consultantId" element={<ProtectedRoute><ConsultantProfile /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
                  <Route path="/shared-project/:projectId" element={<ProtectedRoute><SharedProject /></ProtectedRoute>} />
                  <Route path="/submit-quote/:projectId" element={<ProtectedRoute><SubmitQuote /></ProtectedRoute>} />
                  <Route path="/find-job" element={<ProtectedRoute><FindJob /></ProtectedRoute>} />
                  <Route path="/job-view/:jobId" element={<ProtectedRoute><JobView /></ProtectedRoute>} />
                  <Route path="/draft-brief" element={<ProtectedRoute><DraftBrief /></ProtectedRoute>} />
                  <Route path="/edit-task/:taskId" element={<ProtectedRoute><EditTask /></ProtectedRoute>} />
                  <Route path="/bookmarked-projects" element={<ProtectedRoute><BookmarkedProjects /></ProtectedRoute>} />
                  <Route path="/quoted-projects" element={<ProtectedRoute><QuotedProjects /></ProtectedRoute>} />
                  <Route path="/company-profile/:companyId" element={<ProtectedRoute><CompanyProfile /></ProtectedRoute>} />
                  <Route path="/search" element={<Search />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
