import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Download, 
  MessageSquare, 
  Share2, 
  Pen,
  FileText,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const documentTemplates: Record<string, { title: string; content: string }> = {
  "business-sale-agreement": {
    title: "Business Sale Agreement",
    content: `BUSINESS SALE AGREEMENT

This Business Sale Agreement is dated [DATE]

BETWEEN

(a)    of    (Vendor); and
(b)    of    (Purchaser)

RECITALS

(A)    The Vendor owns and carries on the Business, using the Business Name, at the Premises.
(B)    The Vendor is, or will be on Completion, the owner free from any security interest or third party interest of the Plant, the Stock, the Intellectual Property, the IP Rights and the rights of the Vendor under the Contracts.
(C)    The Vendor employs the Employees in the Business.
(D)    The Vendor wishes to sell to the Purchaser, and the Purchaser wishes to buy from the Vendor, the Business as a going concern.

OPERATIVE PROVISIONS

1.    Definitions and Interpretation
1.1    Definitions

In this agreement unless the context otherwise requires:

Asset means each of the assets of the Business on the Completion Date including the Plant, the Stock, the Intellectual Property, the IP Rights and the`
  },
  "letter-to-council": {
    title: "Letter to Council",
    content: `[Your Name]
[Your Address]
[City, State, Postcode]
[Date]

[Council Name]
[Council Address]
[City, State, Postcode]

Dear Sir/Madam,

RE: Development Application for [Address]

I am writing to submit a development application for the above-mentioned property...`
  },
};

const DocumentEditor = () => {
  const { documentType } = useParams<{ documentType: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documentTitle, setDocumentTitle] = useState("");
  const [content, setContent] = useState("");
  const [progress] = useState(2);

  useEffect(() => {
    if (documentType && documentTemplates[documentType]) {
      const template = documentTemplates[documentType];
      setDocumentTitle(template.title);
      setContent(template.content);
    } else {
      setDocumentTitle("Business Sale Agreement");
      setContent(documentTemplates["business-sale-agreement"].content);
    }
  }, [documentType]);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${documentTitle.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">{documentTitle}</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-1"></span>
                Saved
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              Review
            </Button>
            <Button variant="outline" className="gap-2">
              Track changes
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comments
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2">
              <Pen className="h-4 w-4" />
              eSign
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-0 max-w-full">
        <div className="grid grid-cols-12 gap-0">
          {/* Left Sidebar - Questionnaire */}
          <div className="col-span-3 border-r min-h-screen bg-background">
            <div className="p-6">
              <Tabs defaultValue="questionnaire" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="questionnaire" className="text-xs">
                    Questionnaire
                  </TabsTrigger>
                  <TabsTrigger value="suggestions" className="text-xs">
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger value="draft" className="text-xs">
                    Draft
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="text-xs">
                    Insights
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="questionnaire" className="space-y-4">
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm">
                          On what date will this Agreement be signed?
                        </h3>
                        <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>Unassigned</span>
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary">
                          Assign question
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" />
                          Insert a blank line to answer field
                        </label>
                        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                          <p className="font-medium mb-1">TIPS & COMMON ANSWER</p>
                          <p>Leave blank if it is not known when this Agreement will be signed.</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button variant="ghost" size="sm" disabled>
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                      <Button size="sm" className="bg-primary">
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">PROGRESS (2%)</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="suggestions" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm">AI suggestions will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="draft" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm">Draft options will appear here</p>
                  </div>
                </TabsContent>

                <TabsContent value="insights" className="space-y-4">
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm">Document insights will appear here</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="col-span-9 bg-muted/30">
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                {/* Zoom and Format Controls */}
                <div className="flex items-center justify-center gap-4 mb-6 text-sm">
                  <Button variant="ghost" size="sm">Undo</Button>
                  <Button variant="ghost" size="sm">Redo</Button>
                  <span className="text-muted-foreground">100%</span>
                  <select className="border rounded px-2 py-1 text-sm">
                    <option>Normal text</option>
                  </select>
                </div>

                {/* Document Paper */}
                <Card className="shadow-lg">
                  <CardContent className="p-12">
                    {/* Header Section */}
                    <div className="border-2 border-dashed border-muted-foreground/30 rounded p-6 mb-8 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <FileText className="h-5 w-5" />
                        <span className="text-sm">Add header, footer & logo</span>
                      </div>
                    </div>

                    {/* Document Title */}
                    <div className="text-center mb-8">
                      <h1 className="text-2xl font-bold uppercase tracking-wide">
                        BUSINESS SALE AGREEMENT
                      </h1>
                    </div>

                    {/* Document Content */}
                    <div className="space-y-4 text-sm leading-relaxed">
                      <p>This Business Sale Agreement is dated <span className="bg-blue-100 px-1">___________</span></p>

                      <p className="font-semibold mt-6">BETWEEN</p>

                      <div className="space-y-2 ml-4">
                        <p>(a) <span className="ml-8">of</span> <span className="ml-8">(Vendor)</span>; and</p>
                        <p>(b) <span className="ml-8">of</span> <span className="ml-8">(Purchaser)</span></p>
                      </div>

                      <p className="font-semibold mt-6">RECITALS</p>

                      <div className="space-y-2">
                        <p>(A) The Vendor owns and carries on the Business, using the Business Name, at the Premises.</p>
                        <p>(B) The Vendor is, or will be on Completion, the owner free from any security interest or third party interest of the Plant, the Stock, the Intellectual Property, the IP Rights and the rights of the Vendor under the Contracts.</p>
                        <p>(C) The Vendor employs the Employees in the Business.</p>
                        <p>(D) The Vendor wishes to sell to the Purchaser, and the Purchaser wishes to buy from the Vendor, the Business as a going concern.</p>
                      </div>

                      <p className="font-semibold mt-6">OPERATIVE PROVISIONS</p>

                      <p className="font-semibold mt-4">1. Definitions and Interpretation</p>
                      <p className="font-semibold">1.1 Definitions</p>

                      <p className="mt-2">In this agreement unless the context otherwise requires:</p>

                      <p className="mt-2">
                        <span className="font-semibold">Asset</span> means each of the assets of the Business on the Completion Date including the Plant, the Stock, the Intellectual Property, the IP Rights and the
                      </p>
                    </div>

                    {/* Upgrade Banner */}
                    <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm">You&apos;re building your free document. Upgrade today for:</p>
                          <p className="text-sm text-muted-foreground">Unlimited documents & edits / Access 500+ templates / Download in PDF & DOCX</p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Upgrade
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;
