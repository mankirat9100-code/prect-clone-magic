import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search as SearchIcon, MapPin, Star, Phone, Mail, Bookmark, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockConsultants = [
  {
    id: 7,
    name: "Mark Stevens",
    company: "Port Macquarie Certification Services",
    role: "Private Certifier",
    description: "Accredited private certifier specialising in residential and commercial developments in Port Macquarie",
    location: "Port Macquarie, NSW",
    distance: "2.1 km",
    rating: 4.9,
    reviewCount: 78,
    phone: "+61 2 6584 1234",
    email: "mark@pmcertification.com.au",
    tags: ["Private Certifier", "PCA", "Construction Certificate", "Occupation Certificate"],
    avatar: "/placeholder.svg",
  },
  {
    id: 8,
    name: "Jennifer Walsh",
    company: "Hastings Building Certification",
    role: "Private Certifier",
    description: "Experienced PCA providing fast-track certification services for residential projects",
    location: "Port Macquarie, NSW",
    distance: "3.7 km",
    rating: 4.8,
    reviewCount: 62,
    phone: "+61 2 6584 5678",
    email: "jennifer@hastingscert.com.au",
    tags: ["Private Certifier", "PCA", "Residential", "Fast-Track"],
    avatar: "/placeholder.svg",
  },
  {
    id: 9,
    name: "Robert Hamilton",
    company: "Mid North Coast Certifiers",
    role: "Private Certifier",
    description: "Comprehensive certification services including CC, OC, and complying development",
    location: "Port Macquarie, NSW",
    distance: "1.8 km",
    rating: 4.9,
    reviewCount: 91,
    phone: "+61 2 6584 9012",
    email: "robert@midnorthcert.com.au",
    tags: ["Private Certifier", "PCA", "Complying Development", "CDC"],
    avatar: "/placeholder.svg",
  },
  {
    id: 10,
    name: "Angela Morrison",
    company: "Coastal Certification Group",
    role: "Private Certifier",
    description: "Specialist in coastal development certification and bushfire-prone land compliance",
    location: "Port Macquarie, NSW",
    distance: "4.2 km",
    rating: 4.7,
    reviewCount: 54,
    phone: "+61 2 6584 3456",
    email: "angela@coastalcert.com.au",
    tags: ["Private Certifier", "PCA", "Coastal", "Bushfire Compliance"],
    avatar: "/placeholder.svg",
  },
  {
    id: 1,
    name: "Sarah Mitchell",
    company: "Mitchell Structural Engineering",
    role: "Structural Engineer",
    description: "Specialising in residential and commercial structural design with 15+ years experience",
    location: "Sydney, NSW",
    distance: "3.2 km",
    rating: 4.9,
    reviewCount: 47,
    phone: "+61 2 9876 5432",
    email: "sarah.mitchell@structureengineering.com.au",
    tags: ["Structural Engineer", "Residential", "Commercial"],
    avatar: "/placeholder.svg",
  },
  {
    id: 2,
    name: "David Chen",
    company: "GeoTech Solutions",
    role: "Geotechnical Engineer",
    description: "Expert in soil testing, foundation design and geotechnical investigations",
    location: "Parramatta, NSW",
    distance: "8.5 km",
    rating: 4.8,
    reviewCount: 32,
    phone: "+61 2 9123 4567",
    email: "d.chen@geotech.com.au",
    tags: ["Geotechnical", "Investigation", "Soil Testing"],
    avatar: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Emma Thompson",
    company: "Coastal Design Studio",
    role: "Architect",
    description: "Award-winning architect specialising in sustainable coastal architecture",
    location: "Bondi Beach, NSW",
    distance: "5.8 km",
    rating: 4.9,
    reviewCount: 68,
    phone: "+61 2 9456 7890",
    email: "emma@coastaldesign.com.au",
    tags: ["Architect", "Sustainable", "Coastal"],
    avatar: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Michael Brown",
    company: "Brown & Associates Builders",
    role: "Builder",
    description: "Premium construction services for residential projects across Sydney",
    location: "North Sydney, NSW",
    distance: "6.1 km",
    rating: 4.7,
    reviewCount: 91,
    phone: "+61 2 9789 0123",
    email: "michael.brown@builders.com.au",
    tags: ["Builder", "Construction", "Project Management"],
    avatar: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    company: "Survey Plus",
    role: "Surveyor",
    description: "Comprehensive land surveying and cadastral services",
    location: "Chatswood, NSW",
    distance: "7.3 km",
    rating: 4.8,
    reviewCount: 24,
    phone: "+61 2 9234 5678",
    email: "lisa@surveyplus.com.au",
    tags: ["Surveyor", "Land Survey", "Cadastral"],
    avatar: "/placeholder.svg",
  },
  {
    id: 6,
    name: "James Wilson",
    company: "Planning Experts",
    role: "Town Planner",
    description: "Development application and town planning consultation services",
    location: "Sydney CBD, NSW",
    distance: "4.2 km",
    rating: 4.9,
    reviewCount: 56,
    phone: "+61 2 9567 8901",
    email: "james@planningexperts.com.au",
    tags: ["Town Planner", "DA Support", "Consultation"],
    avatar: "/placeholder.svg",
  },
];

const Search = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [distance, setDistance] = useState("50");
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  // Initialize search based on URL parameters
  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "certifier") {
      setSearchTags(["Private Certifier"]);
    } else if (searchTags.length === 0) {
      setSearchTags(["Structural Engineer"]);
    }
  }, [searchParams]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!searchTags.includes(currentTag.trim())) {
        setSearchTags([...searchTags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSearch = () => {
    console.log("Searching with tags:", searchTags, "within", distance, "km");
  };

  const handleBookmark = (id: number) => {
    if (bookmarked.includes(id)) {
      setBookmarked(bookmarked.filter(bid => bid !== id));
      toast({
        title: "Bookmark removed",
        description: "Consultant removed from bookmarks",
      });
    } else {
      setBookmarked([...bookmarked, id]);
      toast({
        title: "Consultant bookmarked",
        description: "Consultant added to your bookmarks",
      });
    }
  };

  const handleViewProfile = (id: number) => {
    navigate(`/consultant-profile/${id}`);
  };

  // Filter consultants based on search tags
  const filteredConsultants = mockConsultants.filter(consultant => 
    searchTags.length === 0 || searchTags.some(tag => 
      consultant.role.toLowerCase().includes(tag.toLowerCase()) ||
      consultant.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
    )
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-6 max-w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-1">Find Consultants</h1>
          <p className="text-muted-foreground">
            Search from {filteredConsultants.length} verified consultants and contractors
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-4">
          <CardContent className="py-4">
            <div className="flex gap-4 items-end">
              {/* Search Tags */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">
                  Search criteria
                </label>
                <div className="flex gap-2 p-2 border rounded-lg bg-background min-h-[48px] flex-wrap items-center">
                  {searchTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="gap-1 pl-3 pr-2 py-1 text-sm"
                    >
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-3 w-3 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Input
                    placeholder="Add role, specialty, or skill..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    className="flex-1 min-w-[150px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
                </div>
              </div>

              {/* Distance Filter */}
              <div className="w-48">
                <label className="text-sm font-medium mb-2 block">
                  Distance
                </label>
                <Select value={distance} onValueChange={setDistance}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card z-50">
                    <SelectItem value="10">Within 10 km</SelectItem>
                    <SelectItem value="25">Within 25 km</SelectItem>
                    <SelectItem value="50">Within 50 km</SelectItem>
                    <SelectItem value="100">Within 100 km</SelectItem>
                    <SelectItem value="250">Within 250 km</SelectItem>
                    <SelectItem value="any">Any distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button className="gap-2" onClick={handleSearch}>
                <SearchIcon className="h-4 w-4" />
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Split View: Results List (Left) | Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Consultant Listings - Left Side */}
          <div className="overflow-y-auto pr-2 space-y-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {filteredConsultants.map((consultant) => (
              <Card key={consultant.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <Avatar className="h-20 w-20 flex-shrink-0 ring-2 ring-primary/20">
                      <AvatarImage src={consultant.avatar} alt={consultant.name} />
                      <AvatarFallback className="text-2xl font-bold">
                        {consultant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-0.5 leading-tight">{consultant.name}</h3>
                      <p className="text-base text-primary underline font-medium mb-0.5">{consultant.company}</p>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{consultant.role}</p>
                      <p className="text-sm text-muted-foreground/70 italic mb-2 line-clamp-2">{consultant.description}</p>
                      
                      {/* Tags */}
                      <div className="mb-2 flex flex-wrap gap-1">
                        {consultant.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-sm py-0 h-6">
                            {tag}
                          </Badge>
                        ))}
                        {consultant.tags.length > 2 && (
                          <Badge variant="secondary" className="text-sm py-0 h-6">
                            +{consultant.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{consultant.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{consultant.distance} away</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                          <span>{consultant.rating} ({consultant.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{consultant.phone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1.5">
                        <Button 
                          variant="default" 
                          size="sm"
                          className="h-8 px-5 text-sm"
                          onClick={() => handleViewProfile(consultant.id)}
                        >
                          <Eye className="h-4 w-4 mr-1.5" />
                          View Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleBookmark(consultant.id)}
                        >
                          {bookmarked.includes(consultant.id) ? (
                            <Bookmark className="h-4 w-4 fill-current" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => navigate('/messages')}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Map - Right Side */}
          <div className="sticky top-0 h-full hidden lg:block">
            <Card className="h-full">
              <CardContent className="p-0 h-full" style={{ minHeight: 'calc(100vh - 280px)' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106449.94023871384!2d151.10850375!3d-33.8473552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b129838f39a743f%3A0x3017d681632a850!2sSydney%20NSW%2C%20Australia!5e0!3m2!1sen!2sau!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Consultant Locations Map"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
