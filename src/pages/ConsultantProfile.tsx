import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Award, 
  Briefcase,
  CheckCircle,
  Calendar,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockConsultantData = {
  "sarah-mitchell": {
    name: "Sarah Mitchell",
    company: "Coastal Design Studio",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 48,
    specialty: "Residential Design",
    location: "Bondi, NSW",
    email: "sarah@coastaldesign.com.au",
    phone: "+61 2 9130 4567",
    website: "www.coastaldesign.com.au",
    yearsExperience: 10,
    bio: "I'm a passionate residential designer with over 10 years of experience creating beautiful, functional living spaces across Sydney's Eastern Suburbs. My approach combines modern aesthetics with practical functionality, always focusing on maximizing natural light and creating seamless indoor-outdoor flow.",
    specializations: [
      "Residential Extensions",
      "Kitchen Design",
      "Living Area Design",
      "Modern Architecture",
      "Coastal Properties"
    ],
    certifications: [
      "Registered Building Designer - NSW",
      "Member of Building Designers Association",
      "Green Building Accreditation"
    ],
    portfolio: [
      {
        title: "Bondi Beach House Extension",
        description: "Two-story addition with modern kitchen and entertainment area",
        image: "/placeholder.svg",
        year: 2023
      },
      {
        title: "Coogee Family Home",
        description: "Complete renovation with focus on natural light",
        image: "/placeholder.svg",
        year: 2023
      },
      {
        title: "Tamarama Luxury Residence",
        description: "High-end residential design with ocean views",
        image: "/placeholder.svg",
        year: 2022
      }
    ],
    reviews: [
      {
        author: "John Smith",
        rating: 5,
        date: "2 months ago",
        comment: "Sarah's design for our extension was exceptional. She understood our needs perfectly and delivered beyond expectations."
      },
      {
        author: "Emma Wilson",
        rating: 5,
        date: "4 months ago",
        comment: "Professional, creative, and a pleasure to work with. Our new kitchen is exactly what we dreamed of."
      },
      {
        author: "David Chen",
        rating: 4.8,
        date: "6 months ago",
        comment: "Great attention to detail and excellent communication throughout the project."
      }
    ]
  }
};

const ConsultantProfile = () => {
  const { consultantId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const consultant = mockConsultantData[consultantId as keyof typeof mockConsultantData] || mockConsultantData["sarah-mitchell"];

  const handleContact = () => {
    toast({
      title: "Opening Email",
      description: `Composing message to ${consultant.name}...`,
    });
    navigate("/messages");
  };

  const handleRequestQuote = () => {
    toast({
      title: "Quote Request",
      description: `Sending quote request to ${consultant.name}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-3 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      {/* Profile Hero Section */}
      <div className="container mx-auto px-6 py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 flex-shrink-0 ring-4 ring-primary/10">
                <AvatarImage src={consultant.avatar} alt={consultant.name} />
                <AvatarFallback className="text-3xl font-bold">
                  {consultant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{consultant.name}</h1>
                <p className="text-xl text-muted-foreground mb-3">{consultant.company}</p>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  <Badge variant="secondary" className="text-sm">
                    {consultant.specialty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{consultant.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({consultant.reviewCount} reviews)
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{consultant.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{consultant.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{consultant.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{consultant.website}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleContact} className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact
                  </Button>
                  <Button variant="outline" onClick={handleRequestQuote} className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Request Quote
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {consultant.bio}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{consultant.yearsExperience} years</span>
                  <span className="text-muted-foreground">of experience</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Specializations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {consultant.specializations.map((spec, index) => (
                    <Badge key={index} variant="outline">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-4">
            {consultant.portfolio.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{project.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    </div>
                    <Badge variant="secondary">{project.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Project Image</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {consultant.reviews.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{review.author}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-medium">{review.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle>Professional Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {consultant.certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConsultantProfile;
