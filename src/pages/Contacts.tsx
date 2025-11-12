import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building2, Calendar, Briefcase } from "lucide-react";
import { MessageDialog } from "@/components/team/MessageDialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type SortOption = "alphabetical" | "stage";

interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  external_role?: string;
  created_at: string;
  last_communication?: string;
  status?: "engaged" | "pending" | "quoted" | "shortlisted";
  task?: string;
  project?: string;
  project_id?: string;
}

// Mock project-specific contacts
const mockProjectContacts: Contact[] = [
  {
    id: "1",
    full_name: "Sarah Mitchell",
    email: "sarah.mitchell@structureengineering.com.au",
    phone: "+61 2 9876 5432",
    company: "Mitchell Structural Engineering",
    external_role: "structural_engineer",
    created_at: "2024-01-15T10:00:00Z",
    last_communication: "2024-01-20T14:30:00Z",
    status: "engaged",
    task: "Structural Assessment & Design",
    project: "001 Dennis House",
  },
  {
    id: "2",
    full_name: "David Chen",
    email: "d.chen@geotech.com.au",
    phone: "+61 2 9123 4567",
    company: "GeoTech Solutions",
    external_role: "geotechnical_engineer",
    created_at: "2024-01-18T09:00:00Z",
    last_communication: "2024-01-22T11:00:00Z",
    status: "engaged",
    task: "Soil Testing & Geotechnical Report",
    project: "001 Dennis House",
  },
  {
    id: "3",
    full_name: "Emma Thompson",
    email: "emma@coastaldesign.com.au",
    phone: "+61 2 9456 7890",
    company: "Coastal Design Studio",
    external_role: "architect",
    created_at: "2024-01-12T15:00:00Z",
    last_communication: "2024-01-25T16:45:00Z",
    status: "engaged",
    task: "Architectural Design & Documentation",
    project: "001 Dennis House",
  },
  {
    id: "4",
    full_name: "Michael Brown",
    email: "michael.brown@builders.com.au",
    phone: "+61 2 9789 0123",
    company: "Brown & Associates Builders",
    external_role: "builder",
    created_at: "2024-01-20T08:00:00Z",
    status: "pending",
    task: "Construction & Project Management",
    project: "001 Dennis House",
  },
  {
    id: "5",
    full_name: "Lisa Anderson",
    email: "lisa@surveyplus.com.au",
    phone: "+61 2 9234 5678",
    company: "Survey Plus",
    external_role: "surveyor",
    created_at: "2024-01-22T13:00:00Z",
    last_communication: "2024-01-23T10:00:00Z",
    status: "engaged",
    task: "Site Survey & Boundary Identification",
    project: "001 Dennis House",
  },
  {
    id: "6",
    full_name: "James Wilson",
    email: "james@planningexperts.com.au",
    phone: "+61 2 9567 8901",
    company: "Planning Experts",
    external_role: "town_planner",
    created_at: "2024-01-16T11:00:00Z",
    status: "pending",
    task: "Town Planning & DA Support",
    project: "001 Dennis House",
  },
  {
    id: "7",
    full_name: "Rachel Green",
    email: "rachel@energyratings.com.au",
    phone: "+61 2 9890 1234",
    company: "Energy Ratings Australia",
    external_role: "energy_consultant",
    created_at: "2024-01-19T14:00:00Z",
    last_communication: "2024-01-21T09:30:00Z",
    status: "engaged",
    task: "Energy Efficiency Assessment (BASIX)",
    project: "001 Dennis House",
  },
];

const Contacts = () => {
  const [searchParams] = useSearchParams();
  const projectFilter = searchParams.get('project');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [projectFilter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      
      // If project filter is set, use mock project contacts
      if (projectFilter) {
        const filteredContacts = mockProjectContacts.filter(
          contact => contact.project === projectFilter
        );
        setContacts(filteredContacts);
        setLoading(false);
        return;
      }

      // Fetch all projects the user has access to
      const { data: userProjects, error: projectsError } = await supabase
        .from("team_members")
        .select("project_id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (projectsError) throw projectsError;

      if (!userProjects || userProjects.length === 0) {
        // Show mock contacts as fallback
        setContacts(mockProjectContacts);
        setLoading(false);
        return;
      }

      const projectIds = userProjects.map(p => p.project_id);

      // Fetch all team members from those projects
      const { data: teamMembers, error: membersError } = await supabase
        .from("team_members")
        .select("*")
        .in("project_id", projectIds)
        .order("full_name");

      if (membersError) throw membersError;

      // If no team members found, use mock contacts
      if (!teamMembers || teamMembers.length === 0) {
        setContacts(mockProjectContacts);
        setLoading(false);
        return;
      }

      // Fetch last communication for each contact
      const contactsWithComms = await Promise.all(
        (teamMembers || []).map(async (member) => {
          const { data: lastComm } = await supabase
            .from("communications")
            .select("sent_at")
            .eq("team_member_id", member.id)
            .order("sent_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...member,
            last_communication: lastComm?.sent_at,
            project: member.project_id, // We'll need to fetch project names separately
          };
        })
      );

      setContacts(contactsWithComms);
    } catch (error: any) {
      console.error("Error fetching contacts:", error);
      // Show mock contacts on error as well
      setContacts(mockProjectContacts);
    } finally {
      setLoading(false);
    }
  };

  const sortedContacts = [...contacts].sort((a, b) => {
    if (sortBy === "alphabetical") {
      return a.full_name.localeCompare(b.full_name);
    } else {
      // Sort by external_role (stage)
      const roleOrder: Record<string, number> = {
        architect: 1,
        structural_engineer: 2,
        geotechnical_engineer: 3,
        surveyor: 4,
        town_planner: 5,
        energy_consultant: 6,
        builder: 7,
        engineer: 8,
        consultant: 9,
      };
      const aOrder = roleOrder[a.external_role?.toLowerCase() || ""] || 999;
      const bOrder = roleOrder[b.external_role?.toLowerCase() || ""] || 999;
      return aOrder - bOrder;
    }
  });

  const isProjectView = !!projectFilter;
  const pageTitle = isProjectView ? `Contacts - ${projectFilter}` : "Contacts";
  const pageDescription = isProjectView
    ? "Project-specific team members and consultants"
    : "All Current Documents and contacts across your projects";

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "engaged":
        return "default";
      case "pending":
        return "secondary";
      case "quoted":
        return "outline";
      case "shortlisted":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatRole = (role?: string) => {
    if (!role) return "Team Member";
    return role
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleSendEmail = (contact: Contact) => {
    setSelectedContact(contact);
    setMessageDialogOpen(true);
  };

  const handleMessageSent = async (subject: string, message: string) => {
    if (!selectedContact) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get project_id from the contact
      const { data: member } = await supabase
        .from("team_members")
        .select("project_id")
        .eq("id", selectedContact.id)
        .single();

      if (!member) throw new Error("Contact not found");

      // Save communication
      const { error } = await supabase
        .from("communications")
        .insert({
          project_id: member.project_id,
          team_member_id: selectedContact.id,
          subject,
          message,
          sent_by: user.id,
        });

      if (error) throw error;

      toast.success("Message sent successfully");
      fetchContacts(); // Refresh to update last communication
    } catch (error: any) {
      console.error("Error saving communication:", error);
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {pageDescription}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "alphabetical" ? "default" : "outline"}
            onClick={() => setSortBy("alphabetical")}
          >
            Alphabetical
          </Button>
          <Button
            variant={sortBy === "stage" ? "default" : "outline"}
            onClick={() => setSortBy("stage")}
          >
            By Stage
          </Button>
        </div>
      </div>

      {contacts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No contacts found. Add team members to your projects to see them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold">{contact.full_name}</h2>
                      {contact.external_role && (
                        <Badge variant="secondary">
                          {formatRole(contact.external_role)}
                        </Badge>
                      )}
                      {contact.status && (
                        <Badge variant={getStatusColor(contact.status)} className="capitalize">
                          {contact.status}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          {contact.company}
                        </div>
                      )}
                      {contact.project && !isProjectView && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Project: {contact.project}
                        </div>
                      )}
                      {contact.last_communication && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Last email: {formatDistanceToNow(new Date(contact.last_communication), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button onClick={() => handleSendEmail(contact)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {selectedContact && (
        <MessageDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          recipientName={selectedContact.full_name}
          recipientEmail={selectedContact.email}
          role={selectedContact.external_role || "Team Member"}
          onSend={handleMessageSent}
        />
      )}
    </div>
  );
};

export default Contacts;
