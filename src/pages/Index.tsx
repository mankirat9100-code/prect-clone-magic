import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Building,
  Info,
  HelpCircle,
  DollarSign,
  ClipboardList,
  Landmark,
  Users,
  Send,
  Bell,
  MessageSquare,
  Search,
  Bookmark,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PendingResponsesCard } from "@/components/PendingResponsesCard";
import { SharedFoldersWidget } from "@/components/SharedFoldersWidget";
import { VoiceInput } from "@/components/VoiceInput";

const quickActions = [
  {
    title: "Documents",
    icon: FileText,
    path: "/documents",
    color: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Rules",
    icon: Building,
    path: "/rules",
    color: "bg-green-50 dark:bg-green-950",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Project Information",
    icon: Info,
    path: "/project-info",
    color: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Refinement Questions",
    icon: HelpCircle,
    path: "/refinement",
    color: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    title: "Costing",
    icon: DollarSign,
    path: "/costing",
    color: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    title: "Planning",
    icon: ClipboardList,
    path: "/planning",
    color: "bg-cyan-50 dark:bg-cyan-950",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    title: "Council CDC Certifier",
    icon: Landmark,
    path: "/council",
    color: "bg-indigo-50 dark:bg-indigo-950",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "My Team",
    icon: Users,
    path: "/team",
    color: "bg-rose-50 dark:bg-rose-950",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
];

const mockUpdates = [
  {
    id: 1,
    type: "message",
    from: "John Smith - Geotechnical Engineer",
    message: "Quote submitted for soil analysis",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    type: "document",
    from: "Building Designer",
    message: "New plans uploaded to Documents",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "approval",
    from: "Council",
    message: "Development application acknowledged",
    time: "1 day ago",
    unread: false,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [chatMessage, setChatMessage] = useState("");
  const [projectType, setProjectType] = useState("new-house");
  const [projectDescription, setProjectDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"question" | "document">("question");

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;

    toast({
      title: "Message sent to Trevor AI Backup",
      description: "Processing your request...",
    });

    setChatMessage("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Project Name Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Project: Dennis Partners House</h1>
          <p className="text-muted-foreground mt-2">A new 300 square meter house</p>
        </div>

        {/* Ask Trevor AI Chat Box */}
        <Card className="mb-3 border-2 border-purple-500 dark:border-purple-400 bg-purple-50/30 dark:bg-purple-950/20">
          <CardContent className="p-6">
            <div className="flex gap-3">
              <Avatar className="h-10 w-10 bg-primary">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {activeTab === "question" ? (
                  <>
                    <Textarea
                      placeholder="Ask Trevor anything about your project..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="min-h-[90px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendChat();
                        }
                      }}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <VoiceInput
                        onTranscript={(text) => setChatMessage((prev) => (prev ? `${prev} ${text}` : text))}
                      />
                      <Button onClick={handleSendChat} size="sm" disabled={!chatMessage.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg bg-purple-50/50 dark:bg-purple-950/30 hover:border-purple-400 dark:hover:border-purple-600 transition-colors cursor-pointer">
                    <FileText className="h-10 w-10 text-purple-500 dark:text-purple-400 mb-3" />
                    <p className="text-sm font-medium text-foreground mb-1">Drop your document here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                    <input
                      type="file"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          toast({
                            title: "Document uploaded",
                            description: `${file.name} is being reviewed...`,
                          });
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Buttons Below */}
        <div className="flex gap-3 mb-6 ml-[52px]">
          <Button
            onClick={() => setActiveTab("question")}
            variant={activeTab === "question" ? "default" : "outline"}
            size="sm"
          >
            Ask a Question
          </Button>
          <Button
            onClick={() => setActiveTab("document")}
            variant={activeTab === "document" ? "default" : "outline"}
            size="sm"
          >
            Review a Document
          </Button>
        </div>

        {/* Quick Actions - 8 Icons */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
          {quickActions.map((action) => (
            <Card
              key={action.title}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(action.path)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`${action.color} p-3 rounded-lg`}>
                  <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <p className="text-sm font-medium leading-tight">{action.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Information and Site Details - Accordions */}
        <Accordion type="multiple" defaultValue={["project-info", "site-details"]} className="mb-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Project Information Accordion */}
            <AccordionItem value="project-info" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                Project Information
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {/* Project Name */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Name</label>
                  <Input value="001 Dennis House" readOnly className="bg-white dark:bg-white/10" />
                </div>

                {/* Project Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Project Type</label>
                  <Select value={projectType} onValueChange={setProjectType}>
                    <SelectTrigger className="bg-white dark:bg-white/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="new-house">New House</SelectItem>
                      <SelectItem value="retaining-wall">Retaining Wall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Describe Your Project */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Describe Your Project</label>
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Enter project description or use voice input..."
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      className="min-h-[80px] bg-white dark:bg-white/10"
                    />
                    <VoiceInput
                      onTranscript={(text) => setProjectDescription((prev) => (prev ? `${prev} ${text}` : text))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Site Details Accordion */}
            <AccordionItem value="site-details" className="border rounded-lg px-4">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Site Details</AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-4">
                  {/* First Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-base mt-1">24 Harvest Street, Thrumster, New South Wales</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Lot ID</label>
                      <p className="text-base mt-1">185/DP1274735</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Lot Size (m²)</label>
                      <p className="text-base mt-1">734</p>
                    </div>
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Council</label>
                      <p className="text-base mt-1">Port Macquarie</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Zoning</label>
                      <p className="text-base mt-1">R1 General Residential</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Street Frontage (m)</label>
                      <p className="text-base mt-1">24.99</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>

        {/* Main Content - Two Columns */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column - AI Pending Responses */}
          <PendingResponsesCard />

          {/* Middle Column - Updates & Shared Folders */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockUpdates.map((update) => (
                    <div
                      key={update.id}
                      className={`p-4 rounded-lg border ${
                        update.unread ? "bg-primary/5 border-primary/20" : "bg-muted/50"
                      } cursor-pointer hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-medium">{update.from}</p>
                          <p className="text-base text-muted-foreground mt-1">{update.message}</p>
                          <p className="text-sm text-muted-foreground mt-2">{update.time}</p>
                        </div>
                        {update.unread && (
                          <Badge variant="default" className="flex-shrink-0">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shared Folders Widget */}
            <SharedFoldersWidget />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
