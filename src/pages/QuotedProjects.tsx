import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MapPin, DollarSign, Clock, TrendingUp, Mail, Send, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const mockQuotedProjects = [
  {
    id: 1,
    title: "Structural Engineering Services",
    project: "Multi-Storey Residential Building",
    location: "Parramatta, NSW",
    myQuote: "$28,000",
    submittedDate: "3 days ago",
    lastCorrespondence: "3 days ago",
    status: "Under Review",
    statusColor: "secondary" as const,
    contactEmail: "john@multistoreydev.com",
    contactName: "John Smith",
  },
  {
    id: 2,
    title: "Building Design Package",
    project: "Coastal House Extension",
    location: "Coffs Harbour, NSW",
    myQuote: "$16,500",
    submittedDate: "1 week ago",
    lastCorrespondence: "5 days ago",
    status: "Shortlisted",
    statusColor: "default" as const,
    contactEmail: "sarah@coastalhouse.com",
    contactName: "Sarah Johnson",
  },
  {
    id: 3,
    title: "Geotechnical Assessment",
    project: "Industrial Site Development",
    location: "Newcastle, NSW",
    myQuote: "$11,200",
    submittedDate: "2 weeks ago",
    lastCorrespondence: "2 weeks ago",
    status: "Declined",
    statusColor: "destructive" as const,
    contactEmail: "mike@industrialdev.com",
    contactName: "Mike Williams",
  },
];

const QuotedProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sendingFollowUp, setSendingFollowUp] = useState<number | null>(null);

  const handleViewProject = (projectId: number) => {
    navigate(`/job-view/${projectId}`);
  };

  const handleFollowUp = (project: typeof mockQuotedProjects[0]) => {
    navigate("/messages", {
      state: {
        composeTo: project.contactName,
        emailType: "message",
        taskTitle: project.title,
        company: project.project,
      },
    });
  };

  const handleAutomaticFollowUp = async (project: typeof mockQuotedProjects[0]) => {
    setSendingFollowUp(project.id);
    
    try {
      const { data, error } = await supabase.functions.invoke("send-follow-up-email", {
        body: {
          projectTitle: project.title,
          projectName: project.project,
          contactEmail: project.contactEmail,
          contactName: project.contactName,
          myQuote: project.myQuote,
          submittedDate: project.submittedDate,
        },
      });

      if (error) throw error;

      toast({
        title: "Follow-up Sent",
        description: `Automatic follow-up email sent to ${project.contactName}`,
      });
    } catch (error: any) {
      console.error("Error sending follow-up:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send follow-up email",
        variant: "destructive",
      });
    } finally {
      setSendingFollowUp(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8" />
            Projects I've Quoted
          </h1>
          <p className="text-muted-foreground text-sm">
            Track your submitted proposals and their status
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Quotes Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockQuotedProjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Under Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {mockQuotedProjects.filter((p) => p.status === "Under Review").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold flex items-center gap-2">
                33%
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quoted Projects List */}
        <div className="space-y-4">
          {mockQuotedProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2 pt-2 px-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-0.5">{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground/80 italic line-clamp-1">{project.project}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>Submitted {project.submittedDate}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={project.statusColor} className="flex-shrink-0 text-sm">
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-2 px-4">
                <div className="space-y-2">
                  {/* Info Row */}
                  <div className="flex items-center gap-3 flex-wrap text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 flex-shrink-0" />
                      <span className="font-semibold">My Quote: {project.myQuote}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span>Last: {project.lastCorrespondence}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={() => handleViewProject(project.id)}
                      className="h-8 text-sm px-4"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View Project
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/submit-quote/${project.id}`)}
                      className="h-8 text-sm px-4"
                    >
                      <FileText className="h-4 w-4 mr-1.5" />
                      View Proposal
                    </Button>
                    {project.status === "Under Review" && (
                      <>
                        <Button 
                          variant="secondary"
                          size="sm"
                          onClick={() => handleFollowUp(project)}
                          className="h-8 text-sm px-4"
                        >
                          <Mail className="h-4 w-4 mr-1.5" />
                          Follow Up
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAutomaticFollowUp(project)}
                          disabled={sendingFollowUp === project.id}
                          className="h-8 text-sm px-4"
                        >
                          {sendingFollowUp === project.id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1.5" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-1.5" />
                              Auto Follow-Up
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuotedProjects;
