import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Building2, User, Upload, Mic, Sparkles, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const individualSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Valid phone number is required"),
  address: z.string().optional(),
  city: z.string().min(1, "City/town is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().optional(),
  bio: z.string().optional(),
});

const businessSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  business_type: z.string().min(1, "Business type is required"),
  business_email: z.string().email("Valid email is required").optional().or(z.literal("")),
  business_phone: z.string().optional(),
  abn: z.string().optional(),
  website: z.string().url("Valid URL is required").optional().or(z.literal("")),
  business_address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
});

const BUSINESS_TYPES = [
  "Architect",
  "Builder",
  "Certifier",
  "Engineer",
  "Planner",
  "Surveyor",
  "Electrician",
  "Plumber",
  "Landscaper",
  "Interior Designer",
  "Project Manager",
  "Other",
];

export default function Profile() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentContext, setCurrentContext] = useState<"individual" | "business">("individual");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [hasBusinessProfile, setHasBusinessProfile] = useState(false);
  const [businessId, setBusinessId] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isListening, setIsListening] = useState(false);

  const individualForm = useForm<z.infer<typeof individualSchema>>({
    resolver: zodResolver(individualSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      bio: "",
    },
  });

  const businessForm = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      business_name: "",
      business_type: "",
      business_email: "",
      business_phone: "",
      abn: "",
      website: "",
      business_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchProfiles();
    fetchContext();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        individualForm.reset(profile);
        setAvatarUrl(profile.avatar_url || "");
      }

      const { data: businessData } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("created_by", user.id)
        .limit(1);

      if (businessData && businessData.length > 0) {
        businessForm.reset(businessData[0]);
        setHasBusinessProfile(true);
        setBusinesses(businessData);
        setBusinessId(businessData[0].id);
        setLogoUrl(businessData[0].logo_url || "");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  };

  const fetchContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: context } = await supabase
        .from("user_context")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (context) {
        setCurrentContext(context.context_type as "individual" | "business");
      }
    } catch (error) {
      console.error("Error fetching context:", error);
    }
  };

  const switchContext = async (type: "individual" | "business", businessIdParam?: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_context")
        .upsert({
          user_id: user.id,
          context_type: type,
          business_id: businessIdParam || null,
        });

      if (error) throw error;

      setCurrentContext(type);
      toast({
        title: "Context switched",
        description: `Now operating as ${type === "individual" ? "Personal" : "Business"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onIndividualSubmit = async (values: z.infer<typeof individualSchema>) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: userId,
          ...values,
          avatar_url: avatarUrl,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Individual profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onBusinessSubmit = async (values: z.infer<typeof businessSchema>) => {
    setLoading(true);
    try {
      if (hasBusinessProfile) {
        const { error } = await supabase
          .from("business_profiles")
          .update({
            ...values,
            logo_url: logoUrl,
          })
          .eq("id", businessId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("business_profiles")
          .insert({
            ...values,
            logo_url: logoUrl,
            created_by: userId,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setBusinessId(data.id);
          setHasBusinessProfile(true);
        }
      }

      toast({
        title: "Success",
        description: "Business profile saved successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateBusinessProfile = async () => {
    const businessName = businessForm.getValues("business_name");
    const businessType = businessForm.getValues("business_type");
    const city = businessForm.getValues("city");
    const state = businessForm.getValues("state");

    if (!businessName || !businessType) {
      toast({
        title: "Missing Information",
        description: "Please enter business name and type first",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-business-profile", {
        body: { businessName, businessType, city, state },
      });

      if (error) throw error;

      if (data) {
        businessForm.setValue("description", data.description);
        if (data.website && !businessForm.getValues("website")) {
          businessForm.setValue("website", data.website);
        }
        if (data.email && !businessForm.getValues("business_email")) {
          businessForm.setValue("business_email", data.email);
        }

        toast({
          title: "AI Generated",
          description: "Business profile generated successfully",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Not Supported",
        description: "Voice input is not supported in your browser",
        variant: "destructive",
      });
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const currentBio = individualForm.getValues("bio") || "";
      individualForm.setValue("bio", currentBio + (currentBio ? " " : "") + transcript);
    };

    recognition.onerror = () => {
      toast({
        title: "Error",
        description: "Voice input failed",
        variant: "destructive",
      });
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your individual and business profiles
        </p>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="individual" className="gap-2">
            <User className="h-4 w-4" />
            Individual Profile
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            Company Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Individual Profile</h2>
              <p className="text-sm text-muted-foreground">
                Your personal information and contact details
              </p>
            </CardHeader>
            <CardContent>
              <Form {...individualForm}>
                <form onSubmit={individualForm.handleSubmit(onIndividualSubmit)} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>
                          {individualForm.watch("full_name")?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Badge 
                        variant={currentContext === "individual" ? "default" : "outline"}
                        className={currentContext === "individual" ? "bg-blue-500 hover:bg-blue-600" : ""}
                      >
                        Personal
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      {hasBusinessProfile && (
                        <Button 
                          type="button"
                          variant={currentContext === "individual" ? "outline" : "secondary"}
                          size="sm"
                          onClick={() => switchContext("individual")}
                          disabled={currentContext === "individual"}
                        >
                          Switch to Personal
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={individualForm.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+61400000000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City/Town *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={individualForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={individualForm.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={4}
                              placeholder="Tell us about yourself..."
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={startVoiceInput}
                            disabled={isListening}
                          >
                            <Mic className={`h-4 w-4 ${isListening ? "text-red-500" : ""}`} />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Individual Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold">Company Profile</h2>
              <p className="text-sm text-muted-foreground">
                {hasBusinessProfile
                  ? "Manage your business information"
                  : "Create a business profile to unlock additional features"}
              </p>
            </CardHeader>
            <CardContent>
              <Form {...businessForm}>
                <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={logoUrl} />
                        <AvatarFallback>
                          <Building2 className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <Badge 
                        variant={currentContext === "business" ? "default" : "outline"}
                        className={currentContext === "business" ? "bg-purple-500 hover:bg-purple-600" : ""}
                      >
                        Business
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      {hasBusinessProfile && (
                        <Button 
                          type="button"
                          variant={currentContext === "business" ? "outline" : "secondary"}
                          size="sm"
                          onClick={() => switchContext("business", businessId)}
                          disabled={currentContext === "business"}
                        >
                          Switch to Business
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={generateBusinessProfile}
                        disabled={aiLoading}
                      >
                        {aiLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        AI Generate
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={businessForm.control}
                      name="business_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Name *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="business_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Type *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {BUSINESS_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="business_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="business_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Phone</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="If different from personal" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="abn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ABN</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="business_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Business Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="postal_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={businessForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={businessForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={4}
                            placeholder="Describe your business..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : hasBusinessProfile
                      ? "Update Business Profile"
                      : "Create Business Profile"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
