import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Star, MapPin, Clock, DollarSign, Calendar, MessageSquare, CheckCircle, XCircle, Eye, CalendarPlus, FileText, Award, Briefcase, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTaskData = {
  "1": {
    title: "Building Designer Needed",
    project: "001 Dennis House",
    description: "Proposed two bedroom addition with modern kitchen and living area",
    location: "Bondi Beach, NSW",
    postedDate: "2 days ago",
    responses: [
      {
        id: 1,
        consultantId: "sarah-mitchell",
        consultantName: "Sarah Mitchell",
        company: "Coastal Design Studio",
        avatar: "/placeholder.svg",
        rating: 4.9,
        reviewCount: 48,
        specialty: "Residential Design",
        location: "Bondi, NSW",
        responseTime: "2 hours",
        proposedRate: "$150/hour",
        estimatedDuration: "4-6 weeks",
        availability: "Can start next week",
        proposal: "I have over 10 years of experience in residential extensions in the Bondi area. I specialize in modern kitchen and living area designs that maximize natural light and flow. I've completed similar projects in similar coastal environments and understand the unique challenges of building in beachside areas including salt corrosion, wind exposure, and council requirements specific to coastal zones.",
        coverLetter: "Dear Joshua,\n\nI'm excited about the opportunity to work on your two bedroom addition project in Bondi Beach. Having completed over 30 similar projects in the Eastern Suburbs, I understand the importance of creating spaces that complement the coastal lifestyle while meeting all regulatory requirements.\n\nMy approach focuses on maximizing natural light, creating seamless indoor-outdoor transitions, and using materials that stand up to the harsh coastal environment. I'd love to discuss your vision for this project in more detail.\n\nBest regards,\nSarah Mitchell",
        qualifications: [
          { degree: "Bachelor of Building Design", institution: "University of Technology Sydney", year: 2012 },
          { degree: "Certified Building Designer", institution: "Building Designers Association", year: 2013 }
        ],
        reviews: [
          { rating: 5, reviewer: "Michael Brown", date: "2 weeks ago", comment: "Sarah delivered an exceptional design for our Bondi renovation. Professional, creative, and great with council approvals." },
          { rating: 5, reviewer: "Lisa Chen", date: "1 month ago", comment: "Highly recommend! Sarah's attention to detail and understanding of coastal building requirements was invaluable." },
          { rating: 4.5, reviewer: "David Wilson", date: "2 months ago", comment: "Great designer. Very responsive and delivered on time. Would work with again." }
        ],
        attachments: [
          { name: "Portfolio_2024.pdf", size: "4.2 MB", type: "application/pdf" },
          { name: "Coastal_Projects_Examples.pdf", size: "8.1 MB", type: "application/pdf" }
        ],
        status: "pending"
      },
      {
        id: 2,
        consultantId: "james-robertson",
        consultantName: "James Robertson",
        company: "Urban Blueprint",
        avatar: "/placeholder.svg",
        rating: 4.7,
        reviewCount: 32,
        specialty: "Modern Residential",
        location: "Randwick, NSW",
        responseTime: "4 hours",
        proposedRate: "$140/hour",
        estimatedDuration: "5-7 weeks",
        availability: "Available in 2 weeks",
        proposal: "My approach focuses on sustainable design principles while maintaining modern aesthetics. I've worked on 15+ bedroom additions in the Eastern Suburbs, with expertise in council approval processes and sustainable building materials.",
        coverLetter: "Hello Joshua,\n\nI specialize in creating sustainable, modern additions that add real value to properties. My experience with council approvals in the Eastern Suburbs means I can help navigate the approval process smoothly.\n\nRegards,\nJames Robertson",
        qualifications: [
          { degree: "Master of Architecture", institution: "UNSW", year: 2015 }
        ],
        reviews: [
          { rating: 5, reviewer: "Amanda Lee", date: "3 weeks ago", comment: "James is excellent at sustainable design. Our addition is beautiful and energy efficient." },
          { rating: 4.5, reviewer: "Robert Taylor", date: "1 month ago", comment: "Professional service throughout. Good understanding of modern design principles." }
        ],
        attachments: [
          { name: "Recent_Projects.pdf", size: "5.8 MB", type: "application/pdf" }
        ],
        status: "pending"
      },
      {
        id: 3,
        consultantId: "emma-chen",
        consultantName: "Emma Chen",
        company: "Coastal Innovations",
        avatar: "/placeholder.svg",
        rating: 5.0,
        reviewCount: 24,
        specialty: "Luxury Residential",
        location: "Bondi Beach, NSW",
        responseTime: "1 hour",
        proposedRate: "$180/hour",
        estimatedDuration: "4-5 weeks",
        availability: "Can start immediately",
        proposal: "I specialize in high-end residential designs with a focus on creating seamless indoor-outdoor living spaces perfect for the coastal lifestyle. My portfolio includes award-winning projects in Bondi Beach area, and I have excellent relationships with local builders and council.",
        coverLetter: "Hi Joshua,\n\nI'm passionate about creating luxury spaces that capture the essence of coastal living. My local expertise and premium design approach could be perfect for your vision.\n\nBest,\nEmma Chen",
        qualifications: [
          { degree: "Bachelor of Architecture (Honours)", institution: "University of Sydney", year: 2014 },
          { degree: "RAIA Registered Architect", institution: "Australian Institute of Architects", year: 2016 }
        ],
        reviews: [
          { rating: 5, reviewer: "Sophie Martin", date: "1 week ago", comment: "Emma is simply the best. Our home is stunning thanks to her vision and expertise." },
          { rating: 5, reviewer: "Tom Anderson", date: "2 weeks ago", comment: "World-class designer. Worth every dollar. Exceeded all expectations." }
        ],
        attachments: [
          { name: "Award_Winning_Projects.pdf", size: "12.3 MB", type: "application/pdf" },
          { name: "Credentials.pdf", size: "1.5 MB", type: "application/pdf" }
        ],
        status: "pending"
      }
    ]
  },
  "2": {
    title: "Building Designer Needed",
    project: "Sample Project",
    description: "Project description",
    location: "Sydney, NSW",
    postedDate: "1 day ago",
    responses: []
  }
};

const TaskResponses = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedResponse, setSelectedResponse] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const taskData = mockTaskData[taskId as keyof typeof mockTaskData] || mockTaskData["1"];

  const handleViewMore = (response: any) => {
    setSelectedResponse(response);
    setIsSheetOpen(true);
  };

  const handleAccept = (response: any) => {
    navigate("/messages", { 
      state: { 
        composeTo: response.consultantName,
        emailType: 'accept',
        taskTitle: taskData.title,
        company: response.company
      } 
    });
  };

  const handleDecline = (response: any) => {
    navigate("/messages", { 
      state: { 
        composeTo: response.consultantName,
        emailType: 'decline',
        taskTitle: taskData.title,
        company: response.company
      } 
    });
  };

  const handleMessage = (response: any) => {
    navigate("/messages", { 
      state: { 
        composeTo: response.consultantName,
        emailType: 'message',
        taskTitle: taskData.title,
        company: response.company
      } 
    });
  };

  const handleRequestMeeting = (response: any) => {
    navigate("/messages", { 
      state: { 
        composeTo: response.consultantName,
        emailType: 'meeting',
        taskTitle: taskData.title,
        company: response.company
      } 
    });
  };

  const handleViewProfile = (consultantId: string) => {
    navigate(`/consultant-profile/${consultantId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/posted-tasks")}
            className="mb-3 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Posted Tasks
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{taskData.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {taskData.responses.length} consultant{taskData.responses.length !== 1 ? 's' : ''} responded to this task
            </p>
          </div>
        </div>
      </header>

      {/* Task Summary */}
      <div className="container mx-auto px-6 py-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Task Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{taskData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Posted {taskData.postedDate}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 italic">{taskData.description}</p>
          </CardContent>
        </Card>

        {/* Responses List */}
        <div className="space-y-3">
          {taskData.responses.map((response) => (
            <Card key={response.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className="h-14 w-14 flex-shrink-0">
                    <AvatarImage src={response.avatar} alt={response.consultantName} />
                    <AvatarFallback>
                      {response.consultantName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{response.consultantName}</h3>
                        <p className="text-sm text-muted-foreground">{response.company}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{response.rating}</span>
                        <span className="text-sm text-muted-foreground">({response.reviewCount})</span>
                      </div>
                    </div>

                    {/* Compact Info Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <Badge variant="secondary" className="text-sm px-2 py-0.5">
                        <MapPin className="h-4 w-4 mr-1" />
                        {response.location}
                      </Badge>
                      <Badge variant="secondary" className="text-sm px-2 py-0.5">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {response.proposedRate}
                      </Badge>
                      <Badge variant="secondary" className="text-sm px-2 py-0.5">
                        <Calendar className="h-4 w-4 mr-1" />
                        {response.estimatedDuration}
                      </Badge>
                      <Badge variant="secondary" className="text-sm px-2 py-0.5">
                        <Clock className="h-4 w-4 mr-1" />
                        {response.availability}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-2 py-0.5">
                        <Clock className="h-4 w-4 mr-1" />
                        Responds in {response.responseTime}
                      </Badge>
                    </div>

                    {/* Truncated Proposal */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {response.proposal}
                    </p>

                    {/* Actions Row */}
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-8 text-sm px-4"
                        onClick={() => handleAccept(response)}
                      >
                        Accept
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 text-sm px-4"
                        onClick={() => handleMessage(response)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1.5" />
                        Message
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 text-sm px-4 ml-auto"
                        onClick={() => handleViewMore(response)}
                      >
                        View More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Slide-out Detail Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          {selectedResponse && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    <AvatarImage src={selectedResponse.avatar} alt={selectedResponse.consultantName} />
                    <AvatarFallback>
                      {selectedResponse.consultantName.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <SheetTitle className="text-xl mb-1">{selectedResponse.consultantName}</SheetTitle>
                    <p className="text-sm text-muted-foreground mb-2">{selectedResponse.company}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{selectedResponse.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({selectedResponse.reviewCount} reviews)</span>
                      <Badge variant="secondary">{selectedResponse.specialty}</Badge>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <Separator className="my-4" />

              {/* Key Details */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedResponse.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedResponse.proposedRate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedResponse.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedResponse.availability}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Cover Letter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Cover Letter
                </h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {selectedResponse.coverLetter}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Full Proposal */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Full Proposal
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedResponse.proposal}
                </p>
              </div>

              <Separator className="my-4" />

              {/* Qualifications */}
              {selectedResponse.qualifications && selectedResponse.qualifications.length > 0 && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Qualifications
                    </h3>
                    <div className="space-y-3">
                      {selectedResponse.qualifications.map((qual: any, idx: number) => (
                        <div key={idx} className="bg-accent/50 p-3 rounded-md">
                          <p className="font-medium text-sm">{qual.degree}</p>
                          <p className="text-xs text-muted-foreground">{qual.institution} • {qual.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-4" />
                </>
              )}

              {/* Reviews */}
              {selectedResponse.reviews && selectedResponse.reviews.length > 0 && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Recent Reviews
                    </h3>
                    <div className="space-y-4">
                      {selectedResponse.reviews.map((review: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-3 w-3 ${i < Math.floor(review.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <span className="font-medium text-sm">{review.reviewer}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-4" />
                </>
              )}

              {/* Attachments */}
              {selectedResponse.attachments && selectedResponse.attachments.length > 0 && (
                <>
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Attachments
                    </h3>
                    <div className="space-y-2">
                      {selectedResponse.attachments.map((file: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 cursor-pointer transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-4" />
                </>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 sticky bottom-0 bg-background pt-4 pb-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    setIsSheetOpen(false);
                    handleAccept(selectedResponse);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Proposal
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsSheetOpen(false);
                    handleMessage(selectedResponse);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsSheetOpen(false);
                    handleRequestMeeting(selectedResponse);
                  }}
                >
                  <CalendarPlus className="h-4 w-4 mr-2" />
                  Meeting
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => {
                    setIsSheetOpen(false);
                    handleViewProfile(selectedResponse.consultantId);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TaskResponses;
