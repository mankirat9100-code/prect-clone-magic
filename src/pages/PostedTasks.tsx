import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, MessageSquare, Edit, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTasks = [
  {
    id: 1,
    title: "Building Designer Needed",
    project: "001 Dennis House",
    description: "Proposed two bedroom addition with modern kitchen and living area",
    location: "Bondi Beach, NSW",
    postedDate: "2 days ago",
    category: "Design",
    status: "Open",
    responseCount: 8,
    tags: ["Building Designer", "Residential", "Extension"],
  },
  {
    id: 2,
    title: "Structural Engineer Required",
    project: "001 Dennis House",
    description: "Structural assessment and engineering for residential extension",
    location: "Bondi Beach, NSW",
    postedDate: "1 week ago",
    category: "Engineering",
    status: "In Progress",
    responseCount: 15,
    tags: ["Structural Engineer", "Residential", "Assessment"],
  },
  {
    id: 3,
    title: "Geotechnical Investigation",
    project: "001 Dennis House",
    description: "Soil testing and geotechnical report for foundation design",
    location: "Bondi Beach, NSW",
    postedDate: "3 days ago",
    category: "Investigation",
    status: "Open",
    responseCount: 5,
    tags: ["Geotechnical", "Investigation", "Soil Testing"],
  },
  {
    id: 4,
    title: "Electrical Design & Installation",
    project: "Manly Beach Renovation",
    description: "Complete electrical design for bathroom and kitchen renovation",
    location: "Manly, NSW",
    postedDate: "1 day ago",
    category: "Electrical",
    status: "Open",
    responseCount: 3,
    tags: ["Electrician", "Design", "Renovation"],
  },
  {
    id: 5,
    title: "Plumbing Consultant",
    project: "Manly Beach Renovation",
    description: "Plumbing design and consultation for complete bathroom refit",
    location: "Manly, NSW",
    postedDate: "4 days ago",
    category: "Plumbing",
    status: "Open",
    responseCount: 7,
    tags: ["Plumber", "Bathroom", "Consultation"],
  },
  {
    id: 6,
    title: "Architect for Modern Extension",
    project: "Surry Hills Townhouse",
    description: "Design contemporary extension including glass features",
    location: "Surry Hills, NSW",
    postedDate: "5 days ago",
    category: "Architecture",
    status: "In Progress",
    responseCount: 12,
    tags: ["Architect", "Modern", "Extension"],
  },
];

const PostedTasks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');

  // Filter tasks by project if a project parameter is provided
  const filteredTasks = projectFilter 
    ? mockTasks.filter(task => task.project === projectFilter)
    : mockTasks;

  // Group tasks by project
  const tasksByProject = filteredTasks.reduce((acc, task) => {
    if (!acc[task.project]) {
      acc[task.project] = [];
    }
    acc[task.project].push(task);
    return acc;
  }, {} as Record<string, typeof mockTasks>);

  const handleViewResponses = (taskId: number) => {
    navigate(`/task-responses/${taskId}`);
  };

  const handleEditTask = (taskId: number) => {
    navigate(`/edit-task/${taskId}`);
  };

  const isProjectView = !!projectFilter;
  const headerTitle = isProjectView 
    ? `Posted Project Tasks - ${projectFilter}`
    : "All Posted Jobs";
  const headerDescription = isProjectView
    ? `Active tasks for ${projectFilter}`
    : `All active job postings across your projects`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{headerTitle}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {headerDescription} ({filteredTasks.length} job{filteredTasks.length !== 1 ? 's' : ''})
              </p>
            </div>
            {isProjectView && (
              <Badge variant="outline" className="text-sm">
                Project View
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {isProjectView ? (
            // Project-specific view - no grouping
            <div className="space-y-2">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2 pt-2 px-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-0.5">{task.title}</CardTitle>
                          <p className="text-sm text-muted-foreground/80 italic line-clamp-1 mb-1">{task.description}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Clock className="h-4 w-4 flex-shrink-0" />
                              <span>{task.postedDate}</span>
                            </div>
                            <button 
                              onClick={() => handleViewResponses(task.id)}
                              className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
                            >
                              <MessageSquare className="h-4 w-4 flex-shrink-0" />
                              <span>{task.responseCount} response{task.responseCount !== 1 ? 's' : ''}</span>
                            </button>
                          </div>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0 text-sm">{task.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-2 px-4">
                      <div className="flex items-end justify-between gap-3">
                        {/* Tags and Location */}
                        <div className="flex items-center gap-2 flex-wrap flex-1">
                          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{task.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-sm py-0 px-2">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="secondary" className="text-sm py-0 px-2">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button 
                            variant="default" 
                            size="sm"
                            className="h-8 text-sm px-4"
                            onClick={() => handleViewResponses(task.id)}
                          >
                            <Eye className="h-4 w-4 mr-1.5" />
                            View Responses
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-8 px-4"
                            onClick={() => handleEditTask(task.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No jobs posted for this project yet.</p>
                </Card>
              )}
            </div>
          ) : (
            // Dashboard view - grouped by project
            <>
              {Object.entries(tasksByProject).map(([projectName, tasks]) => (
                <div key={projectName} className="space-y-2">
                  {/* Project Heading */}
                  <h2 className="text-xl font-semibold text-foreground border-b pb-2">
                    {projectName}
                  </h2>
                  
                  {/* Tasks for this project */}
                  {tasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2 pt-2 px-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg mb-0.5">{task.title}</CardTitle>
                            <p className="text-sm text-muted-foreground/80 italic line-clamp-1 mb-1">{task.description}</p>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-4 w-4 flex-shrink-0" />
                                <span>{task.postedDate}</span>
                              </div>
                              <button 
                                onClick={() => handleViewResponses(task.id)}
                                className="flex items-center gap-1.5 text-primary hover:underline cursor-pointer"
                              >
                                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                                <span>{task.responseCount} response{task.responseCount !== 1 ? 's' : ''}</span>
                              </button>
                            </div>
                          </div>
                          <Badge variant="secondary" className="flex-shrink-0 text-sm">{task.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0 pb-2 px-4">
                        <div className="flex items-end justify-between gap-3">
                          {/* Tags and Location */}
                          <div className="flex items-center gap-2 flex-wrap flex-1">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{task.location}</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-sm py-0 px-2">
                                  {tag}
                                </Badge>
                              ))}
                              {task.tags.length > 2 && (
                                <Badge variant="secondary" className="text-sm py-0 px-2">
                                  +{task.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button 
                              variant="default" 
                              size="sm"
                              className="h-8 text-sm px-4"
                              onClick={() => handleViewResponses(task.id)}
                            >
                              <Eye className="h-4 w-4 mr-1.5" />
                              View Responses
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="h-8 px-4"
                              onClick={() => handleEditTask(task.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostedTasks;
