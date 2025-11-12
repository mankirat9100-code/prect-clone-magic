import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageSquare, Calendar, FileText, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockBookmarkedProjects = [
  {
    id: 1,
    title: "Architect Needed for Renovation",
    project: "Victorian Cottage Restoration",
    description: "Seeking experienced architect for heritage restoration project",
    location: "Newtown, NSW",
    savedDate: "5 days ago",
    postedDate: "5 days ago",
    status: "Open",
    category: "Architecture",
    tags: ["Architect", "Heritage", "Renovation"],
  },
  {
    id: 2,
    title: "Surveyor Required",
    project: "Rural Property Development",
    description: "Land survey needed for rural property subdivision",
    location: "Southern Highlands, NSW",
    savedDate: "1 week ago",
    postedDate: "10 days ago",
    status: "Closed",
    category: "Surveying",
    tags: ["Surveyor", "Rural", "Land Survey"],
  },
  {
    id: 3,
    title: "Building Designer Needed",
    project: "Modern Family Home",
    description: "Contemporary design for new 4-bedroom residence",
    location: "Bondi Beach, NSW",
    savedDate: "3 days ago",
    postedDate: "3 days ago",
    status: "Open",
    category: "Design",
    tags: ["Building Designer", "Residential", "Modern"],
  },
];

const BookmarkedProjects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Group jobs by project
  const jobsByProject = mockBookmarkedProjects.reduce((acc, job) => {
    if (!acc[job.project]) {
      acc[job.project] = [];
    }
    acc[job.project].push(job);
    return acc;
  }, {} as Record<string, typeof mockBookmarkedProjects>);

  const handleRemoveBookmark = (jobId: number) => {
    toast({
      title: "Bookmark Removed",
      description: "Job removed from your bookmarks",
    });
  };

  const handleSubmitQuote = (jobId: number) => {
    navigate(`/submit-quote/${jobId}`);
  };

  const handleSendMessage = (jobId: number) => {
    navigate('/messages');
  };

  const handleScheduleCall = (jobId: number) => {
    toast({
      title: "Schedule a Call",
      description: "Opening scheduling interface...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">Bookmarked Jobs</h1>
            <p className="text-sm text-muted-foreground mt-1">
              You have {mockBookmarkedProjects.length} bookmarked job{mockBookmarkedProjects.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {Object.entries(jobsByProject).map(([projectName, jobs]) => (
            <div key={projectName} className="space-y-2">
              {/* Project Heading */}
              <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                {projectName}
              </h2>
              
              {/* Jobs for this project */}
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 pt-2 px-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <CardTitle className="text-lg">{job.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground/80 italic line-clamp-1 mb-1">{job.description}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>Saved {job.savedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={job.status === "Open" ? "default" : "secondary"} 
                          className="flex-shrink-0 text-sm"
                        >
                          {job.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveBookmark(job.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-2 px-4">
                    <div className="flex items-end justify-between gap-3">
                      {/* Left side: Location, Tags, and Posted Date */}
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{job.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-sm py-0 px-2">
                                {tag}
                              </Badge>
                            ))}
                            {job.tags.length > 2 && (
                              <Badge variant="secondary" className="text-sm py-0 px-2">
                                +{job.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Posted Date Badge */}
                        <Badge 
                          variant="outline" 
                          className="bg-orange-50 text-orange-700 border-orange-200 font-semibold text-sm w-fit"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Posted {job.postedDate}
                        </Badge>
                      </div>
                      
                      {/* Right side: Action Buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="h-8 text-sm px-4"
                          onClick={() => navigate(`/job-view/${job.id}`)}
                        >
                          <FileText className="h-4 w-4 mr-1.5" />
                          View Project
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 text-sm px-4"
                          onClick={() => handleSubmitQuote(job.id)}
                        >
                          <FileText className="h-4 w-4 mr-1.5" />
                          Submit Quote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookmarkedProjects;
