import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, MapPin, Clock, Briefcase, X, Star, Bookmark, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockJobs = [
  {
    id: 1,
    title: "Building Designer Needed",
    project: "Residential Extension - Bondi",
    description: "Proposed two bedroom addition with modern kitchen and living area",
    location: "Bondi Beach, NSW",
    distance: "5.2 km",
    postedDate: "2 days ago",
    category: "Design",
    status: "Open",
    rating: 4.8,
    reviewCount: 24,
    tags: ["Building Designer", "Residential", "Extension"],
    company: {
      id: "coastal-developments",
      name: "Coastal Developments",
      logo: "/placeholder.svg",
      rating: 4.7,
      reviewCount: 156,
    }
  },
  {
    id: 2,
    title: "Structural Engineer Required",
    project: "Commercial Building - CBD",
    description: "New four-story commercial office building with ground floor retail",
    location: "Sydney CBD, NSW",
    distance: "12.8 km",
    postedDate: "1 week ago",
    category: "Engineering",
    status: "Open",
    rating: 4.9,
    reviewCount: 52,
    tags: ["Structural Engineer", "Commercial", "CBD"],
    company: {
      id: "metro-construction",
      name: "Metro Construction Group",
      logo: "/placeholder.svg",
      rating: 4.9,
      reviewCount: 203,
    }
  },
  {
    id: 3,
    title: "Geotechnical Investigation",
    project: "Land Development - Blue Mountains",
    description: "Proposed subdivision development - 12 residential lots",
    location: "Blue Mountains, NSW",
    distance: "78.5 km",
    postedDate: "3 days ago",
    category: "Investigation",
    status: "Open",
    rating: 4.6,
    reviewCount: 18,
    tags: ["Geotechnical", "Investigation", "Land Development"],
    company: {
      id: "dennis-partners",
      name: "Dennis Partners Engineers",
      logo: "/placeholder.svg",
      rating: 4.9,
      reviewCount: 34,
    }
  },
];

const FindJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTags, setSearchTags] = useState<string[]>(["Structural Engineer"]);
  const [currentTag, setCurrentTag] = useState("");
  const [distance, setDistance] = useState("50");
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);

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
    // TODO: Implement search functionality
  };

  const handleBookmark = (jobId: number) => {
    if (bookmarkedJobs.includes(jobId)) {
      setBookmarkedJobs(bookmarkedJobs.filter(id => id !== jobId));
      toast({
        title: "Bookmark removed",
        description: "Project removed from bookmarks",
      });
    } else {
      setBookmarkedJobs([...bookmarkedJobs, jobId]);
      toast({
        title: "Project bookmarked",
        description: "Project added to your bookmarks",
      });
    }
  };

  const handleViewProject = (jobId: number) => {
    navigate(`/job-view/${jobId}`);
  };

  const handleViewCompany = (companyId: string) => {
    navigate(`/company-profile/${companyId}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto p-6 max-w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-1">Find a Job</h1>
          <p className="text-muted-foreground">
            We've catalogued {mockJobs.length} jobs for you based on your profile
          </p>
        </div>

        {/* Search Bar - Full Width */}
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
                    placeholder="Add tags..."
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
                    <SelectItem value="500">Within 500 km</SelectItem>
                    <SelectItem value="1000">Within 1000 km</SelectItem>
                    <SelectItem value="any">Any distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Search Button */}
              <Button className="gap-2" onClick={handleSearch}>
                <Search className="h-4 w-4" />
                Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Split View: Jobs List (Left) | Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 overflow-hidden">
          {/* Job Listings - Left Side */}
          <div className="overflow-y-auto pr-2 space-y-2" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            {mockJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  {/* Main Content - Left */}
                  <div className="flex-1 min-w-0">
                    {/* Title and Project */}
                    <h3 className="text-lg font-semibold mb-0.5 leading-tight">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mb-0.5">{job.project}</p>
                    <p className="text-sm text-muted-foreground/70 italic mb-2 line-clamp-1">{job.description}</p>
                    
                    {/* Tags */}
                    <div className="mb-2 flex flex-wrap gap-1">
                      {job.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-sm py-0 h-6">
                          {tag}
                        </Badge>
                      ))}
                      {job.tags.length > 2 && (
                        <Badge variant="secondary" className="text-sm py-0 h-6">
                          +{job.tags.length - 2}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-sm py-0 h-6">{job.status}</Badge>
                    </div>
                    
                    {/* Details - Compact Grid */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate">{job.distance} away</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        <span>{job.rating} ({job.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>{job.postedDate}</span>
                      </div>
                    </div>

                    {/* Actions - Compact */}
                    <div className="flex gap-1.5">
                      <Button 
                        variant="default" 
                        size="sm"
                        className="h-8 px-5 text-sm"
                        onClick={() => handleViewProject(job.id)}
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleBookmark(job.id)}
                      >
                        {bookmarkedJobs.includes(job.id) ? (
                          <Bookmark className="h-4 w-4 fill-current" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Company Logo - Right */}
                  <div 
                    className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleViewCompany(job.company.id)}
                  >
                    <Avatar className="h-20 w-20 flex-shrink-0 ring-2 ring-primary/20">
                      <AvatarImage src={job.company.logo} alt={job.company.name} />
                      <AvatarFallback className="text-2xl font-bold">{job.company.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center max-w-[80px]">
                      <p className="text-xs font-medium truncate leading-tight">{job.company.name}</p>
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        <Star className="h-2.5 w-2.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          {job.company.rating}
                        </span>
                      </div>
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
                  title="Job Locations Map"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindJob;
