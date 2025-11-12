import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Plus, Star, Search } from "lucide-react";
import DocumentAISidebar from "@/components/DocumentAISidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type DocumentTemplate = {
  id: string;
  title: string;
  description: string;
  category?: string;
};

const recommendedTemplates: DocumentTemplate[] = [
  {
    id: "term-sheet-sale-business",
    title: "Term Sheet - Sale of Business",
    description: "Outlines key terms before finalising a business sale agreement, useful for negotiations.",
  },
  {
    id: "deed-of-novation",
    title: "Deed of Novation",
    description: "Transfers existing contracts to the new business owner after a sale.",
  },
  {
    id: "patent-assignment",
    title: "Patent Assignment - Free Template | Lawpath",
    description: "Transfers intellectual property rights, such as patents, during a business sale.",
  },
  {
    id: "assignment-intellectual-property",
    title: "Assignment of Intellectual Property",
    description: "Ensures all IP assets are properly transferred to the buyer in a business sale.",
  },
  {
    id: "consent-to-act",
    title: "Consent to Act as Director",
    description: "Required to formally appoint company directors during company setup.",
  },
  {
    id: "shareholders-circulating-resolution",
    title: "Shareholders' Circulating Resolution (Ordinary ...",
    description: "Facilitates important company decisions without physical meetings.",
  },
  {
    id: "director-agreement",
    title: "Director Agreement",
    description: "Clarifies director roles, responsibilities, and protects interests from the outset.",
  },
  {
    id: "constitution-proprietary",
    title: "Constitution (Proprietary Company)",
    description: "Essential for setting internal rules when registering a new company.",
  },
];

const popularTemplates: DocumentTemplate[] = [
  {
    id: "business-sale-agreement",
    title: "Business Sale Agreement",
    description: "A Business Sale Agreement is used to clearly set out all relevant terms of the sale when selling or buying a business.",
    category: "Popular",
  },
  {
    id: "letter-to-council",
    title: "Letter to Council",
    description: "Formal correspondence to local council regarding development applications.",
    category: "Popular",
  },
  {
    id: "statement-environmental-effects",
    title: "Statement of Environmental Effects",
    description: "Environmental impact assessment document for development applications.",
    category: "Popular",
  },
  {
    id: "modification-request",
    title: "Modification Request",
    description: "Request for development application modifications.",
    category: "Popular",
  },
  {
    id: "consultant-brief",
    title: "Consultant Brief",
    description: "Detailed project brief for consultants and service providers.",
    category: "Popular",
  },
  {
    id: "compliance-report",
    title: "Compliance Report",
    description: "Building code compliance documentation.",
    category: "Popular",
  },
  {
    id: "variation-order",
    title: "Variation Order",
    description: "Contract variation documentation for construction projects.",
    category: "Popular",
  },
  {
    id: "site-inspection",
    title: "Site Inspection Report",
    description: "Comprehensive site inspection documentation.",
    category: "Popular",
  },
];

const NewDocument = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("popular");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ id: string; title: string } | null>(null);

  const handleSelectDocument = (docId: string, docTitle: string) => {
    setSelectedDocument({ id: docId, title: docTitle });
    setIsSidebarOpen(true);
  };

  const filteredPopular = popularTemplates.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/documents">My documents</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>New documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-3xl font-bold">New Document</h1>
          </div>
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Try ... NDIS"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="favourites" className="gap-2">
              <Star className="h-4 w-4" />
              Favourites
            </TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new-business">New business</TabsTrigger>
            <TabsTrigger value="existing-business">Existing business</TabsTrigger>
            <TabsTrigger value="online-business">Online business</TabsTrigger>
            <TabsTrigger value="personal">Personal matters</TabsTrigger>
            <TabsTrigger value="employment">Employment & HR</TabsTrigger>
            <TabsTrigger value="others">Others</TabsTrigger>
          </TabsList>

          {/* Favourites Tab */}
          <TabsContent value="favourites" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Favourites [0]</h2>
              <Card className="p-8 text-center">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Star your favourite document templates</h3>
                <p className="text-sm text-muted-foreground">
                  Once you favourite a document template, you&apos;ll see them here
                </p>
              </Card>
            </div>

            {/* Recommended by AI */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Recommended by Lawpath AI 
                <span className="text-primary">[8]</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm leading-tight flex-1">
                          {template.title}
                        </h3>
                        <Star className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 text-primary hover:text-primary"
                        onClick={() => handleSelectDocument(template.id, template.title)}
                      >
                        <Plus className="h-4 w-4" />
                        Create document
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Popular Tab */}
          <TabsContent value="popular" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Popular [{popularTemplates.length}]</h2>
              
              {/* First Template with Star */}
              <div className="mb-6">
                <div className="flex items-start gap-3 p-4 border rounded-lg">
                  <Star className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{popularTemplates[0].title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {popularTemplates[0].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPopular.slice(1).map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-sm leading-tight flex-1">
                          {template.title}
                        </h3>
                        <Star className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {template.description}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 text-primary hover:text-primary"
                        onClick={() => handleSelectDocument(template.id, template.title)}
                      >
                        <Plus className="h-4 w-4" />
                        Create document
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Other tabs placeholders */}
          {["new-business", "existing-business", "online-business", "personal", "employment", "others"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="text-center py-12 text-muted-foreground">
                Templates for this category coming soon
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <DocumentAISidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        documentType={selectedDocument?.id || ""}
        documentTitle={selectedDocument?.title || ""}
      />
    </div>
  );
};

export default NewDocument;
