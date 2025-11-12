import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Share2,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Linkedin,
  Instagram,
  Edit,
  Save,
  X,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const projectImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80",
  "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80",
];

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  
  // Profile data state
  const [companyName, setCompanyName] = useState("Dennis Partners Engineers");
  const [aboutText, setAboutText] = useState([
    "Dennis Partners Engineers is a leading structural engineering consultancy with over 25 years of experience delivering innovative and cost-effective solutions for residential, commercial, and industrial projects across Sydney and NSW.",
    "Our team of experienced structural engineers specializes in both new construction and renovation projects, providing comprehensive engineering services including structural design, inspections, certifications, and consulting. We pride ourselves on delivering exceptional service with a focus on safety, quality, and client satisfaction.",
    "From small residential renovations to large-scale commercial developments, Dennis Partners Engineers has the expertise and resources to handle projects of any size and complexity. We work closely with architects, builders, and property owners to ensure structural integrity while meeting budget and timeline requirements."
  ]);
  const [specialties, setSpecialties] = useState([
    "Structural Engineering",
    "Residential Design",
    "Commercial Projects",
    "Building Inspections",
    "Compliance Certification",
    "Renovation Engineering",
    "Foundation Design",
    "Seismic Design"
  ]);
  const [phone, setPhone] = useState("(02) 9977 4499");
  const [email, setEmail] = useState("info@dennispartners.com.au");
  const [website, setWebsite] = useState("www.dennispartners.com.au");
  const [newSpecialty, setNewSpecialty] = useState("");
  
  // AI Chat state
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I'm here to help you review and update your company profile. What would you like to improve?" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  const handleContact = () => {
    console.log("Contact company");
  };

  const handleShare = () => {
    console.log("Share profile");
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your company profile has been saved successfully",
    });
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter(s => s !== specialty));
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsAILoading(true);

    try {
      // TODO: Implement actual AI call to edge function
      // Simulate AI response for now
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "I can help you improve that section. Would you like me to suggest some updates based on industry best practices?"
        }]);
        setIsAILoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsAILoading(false);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex gap-2">
            <Sheet open={isAIOpen} onOpenChange={setIsAIOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Assistant
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Profile AI Assistant</SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Messages */}
                  <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
                    {messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isAILoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask for help with your profile..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage} disabled={isAILoading}>
                      Send
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {isEditing ? (
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Carousel */}
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={projectImages[currentImageIndex]}
                  alt="Project"
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={previousImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {projectImages.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Company Info Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" alt="Dennis Partners Engineers" />
                    <AvatarFallback className="text-2xl">DP</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="text-3xl font-bold mb-2 h-auto"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold mb-2">{companyName}</h1>
                    )}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="h-5 w-5 text-yellow-500 fill-yellow-500"
                          />
                        ))}
                      </div>
                      <span className="text-lg font-semibold">4.9</span>
                      <span className="text-muted-foreground">|</span>
                      <span className="text-muted-foreground">34 Reviews</span>
                      <span className="text-muted-foreground">|</span>
                      <Badge variant="secondary">Structural Engineering</Badge>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button onClick={handleContact}>
                        Contact Company
                      </Button>
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Facebook className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Instagram className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Linkedin className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">About</h2>
                {isEditing ? (
                  <div className="space-y-4">
                    {aboutText.map((paragraph, idx) => (
                      <Textarea
                        key={idx}
                        value={paragraph}
                        onChange={(e) => {
                          const newAbout = [...aboutText];
                          newAbout[idx] = e.target.value;
                          setAboutText(newAbout);
                        }}
                        rows={4}
                        className="text-muted-foreground"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4 text-muted-foreground">
                    {aboutText.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold mb-4">Specialties</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-2">
                      {specialty}
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveSpecialty(specialty)}
                          className="hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add new specialty..."
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddSpecialty()}
                    />
                    <Button onClick={handleAddSpecialty} variant="outline">
                      Add
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        73 Belgrave Street<br />
                        Manly NSW 2095<br />
                        Australia
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Phone</p>
                      {isEditing ? (
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="text-sm mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Email</p>
                      {isEditing ? (
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="text-sm mt-1"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground">{email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">Website</p>
                      {isEditing ? (
                        <Input
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="text-sm mt-1"
                        />
                      ) : (
                        <a 
                          href={`https://${website}`} 
                          className="text-sm text-primary hover:underline"
                        >
                          {website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Location</h3>
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3316.0769276583806!2d151.28584!3d-33.79877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12a40f87f4f3b3%3A0x5017d681632bff0!2s73%20Belgrave%20St%2C%20Manly%20NSW%202095!5e0!3m2!1sen!2sau!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <Button className="w-full mt-4" variant="outline">
                  See Maps
                </Button>
              </CardContent>
            </Card>

            {/* License Information */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">License Information</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">License No.</p>
                    <p className="font-medium">NPER123456</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ABN</p>
                    <p className="font-medium">12 345 678 901</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
