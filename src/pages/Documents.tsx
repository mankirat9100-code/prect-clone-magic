import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Upload, 
  Pen,
  Search,
  MoreVertical,
  FolderPlus,
  Pencil,
  Trash2,
  FileType,
  FileSpreadsheet,
  Download,
  Eye,
  AlertTriangle,
  Archive,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type Document = {
  id: string;
  documentNumber: string;
  documentType: string;
  name: string;
  description: string;
  issueDate: string;
  revisionNumber: string;
  type: 'pdf' | 'word' | 'excel' | 'other';
  fileType: string;
  modified_at: string;
  uploaded_by: string;
  size: string;
  status: 'current' | 'archived';
  supersededBy?: string;
  is_free?: boolean;
};

const DUMMY_DOCUMENTS: Document[] = [
  {
    id: "1",
    documentNumber: "DH-001-ARH-001",
    documentType: "Architectural",
    name: "Architectural Plans - Ground Floor",
    description: "Detailed ground floor architectural drawings including all room dimensions and specifications",
    issueDate: "2025-10-25",
    revisionNumber: "Rev C",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-10-25T14:30:00",
    uploaded_by: "Sarah Mitchell",
    size: "2.4 MB",
    status: "current",
  },
  {
    id: "2",
    documentNumber: "DH-001-STR-001",
    documentType: "Structural",
    name: "Structural Engineering Report",
    description: "Comprehensive structural assessment and foundation recommendations",
    issueDate: "2025-10-24",
    revisionNumber: "Rev B",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-10-24T09:15:00",
    uploaded_by: "Michael Chen",
    size: "5.8 MB",
    status: "current",
  },
  {
    id: "3",
    documentNumber: "DH-001-GEO-001",
    documentType: "Geotechnical",
    name: "Geotechnical Soil Report",
    description: "Site soil analysis and bearing capacity report for foundation design",
    issueDate: "2025-10-23",
    revisionNumber: "Rev A",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-10-23T16:45:00",
    uploaded_by: "David Thompson",
    size: "3.2 MB",
    status: "current",
  },
  {
    id: "4",
    documentNumber: "DH-001-CNC-001",
    documentType: "Council",
    name: "Council DA Submission",
    description: "Development Application package submitted to Port Macquarie Council",
    issueDate: "2025-10-22",
    revisionNumber: "Rev D",
    type: "word",
    fileType: "DOCX",
    modified_at: "2025-10-22T11:20:00",
    uploaded_by: "Emma Wilson",
    size: "1.8 MB",
    status: "current",
  },
  {
    id: "5",
    documentNumber: "DH-001-CST-001",
    documentType: "Costing",
    name: "Cost Estimate Breakdown",
    description: "Itemized construction cost estimates and budget allocation",
    issueDate: "2025-10-21",
    revisionNumber: "Rev C",
    type: "excel",
    fileType: "XLSX",
    modified_at: "2025-10-21T13:00:00",
    uploaded_by: "Joshua Dennis",
    size: "890 KB",
    status: "current",
  },
  {
    id: "6",
    documentNumber: "DH-001-HYD-001",
    documentType: "Hydraulic",
    name: "Hydraulic Drainage Plans",
    description: "Stormwater and drainage system design with detention calculations",
    issueDate: "2025-10-20",
    revisionNumber: "Rev B",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-10-20T10:30:00",
    uploaded_by: "James Roberts",
    size: "4.1 MB",
    status: "current",
  },
  {
    id: "7",
    documentNumber: "DH-001-CNT-001",
    documentType: "Contract",
    name: "Building Contract Agreement",
    description: "Master building contract with terms and conditions",
    issueDate: "2025-10-19",
    revisionNumber: "Rev A",
    type: "word",
    fileType: "DOCX",
    modified_at: "2025-10-19T15:45:00",
    uploaded_by: "Joshua Dennis",
    size: "650 KB",
    status: "current",
  },
  {
    id: "8",
    documentNumber: "DH-001-SRV-001",
    documentType: "Survey",
    name: "Site Survey Report",
    description: "Detailed topographical survey with contours and existing features",
    issueDate: "2025-10-18",
    revisionNumber: "Rev A",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-10-18T08:30:00",
    uploaded_by: "Sarah Mitchell",
    size: "6.2 MB",
    status: "current",
  },
  {
    id: "9",
    documentNumber: "DH-001-ARH-001",
    documentType: "Architectural",
    name: "Architectural Plans - Ground Floor",
    description: "Previous version - superseded by Rev C",
    issueDate: "2025-09-15",
    revisionNumber: "Rev B",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-09-15T10:20:00",
    uploaded_by: "Sarah Mitchell",
    size: "2.2 MB",
    status: "archived",
    supersededBy: "1",
  },
  {
    id: "10",
    documentNumber: "DH-001-STR-001",
    documentType: "Structural",
    name: "Structural Engineering Report",
    description: "Initial structural assessment - superseded by Rev B",
    issueDate: "2025-09-10",
    revisionNumber: "Rev A",
    type: "pdf",
    fileType: "PDF",
    modified_at: "2025-09-10T14:00:00",
    uploaded_by: "Michael Chen",
    size: "5.5 MB",
    status: "archived",
    supersededBy: "2",
  },
];

const Documents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(DUMMY_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [documentToArchive, setDocumentToArchive] = useState<Document | null>(null);
  const [supersedeDialogOpen, setSupersedeDialogOpen] = useState(false);
  const [documentToSupersede, setDocumentToSupersede] = useState<Document | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'archived'>('current');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [documentToPreview, setDocumentToPreview] = useState<Document | null>(null);

  const currentDocuments = documents.filter(doc => doc.status === 'current');
  const archivedDocuments = documents.filter(doc => doc.status === 'archived');

  const handleArchiveClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToArchive(doc);
    setArchiveDialogOpen(true);
  };

  const handleConfirmArchive = () => {
    if (documentToArchive) {
      setDocuments(docs => docs.map(doc => 
        doc.id === documentToArchive.id 
          ? { ...doc, status: 'archived' as const }
          : doc
      ));
      toast({
        title: "Document Archived",
        description: `${documentToArchive.name} has been moved to the archive`,
      });
      setArchiveDialogOpen(false);
      setDocumentToArchive(null);
    }
  };

  const handleDeleteClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter(doc => doc.id !== documentToDelete.id));
      toast({
        title: "Document Deleted",
        description: `${documentToDelete.name} has been removed from the project`,
      });
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const handleSupersedeClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToSupersede(doc);
    setSupersedeDialogOpen(true);
  };

  const handleViewClick = (doc: Document, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocumentToPreview(doc);
    setPreviewDialogOpen(true);
  };

  const handleConfirmSupersede = () => {
    if (documentToSupersede) {
      // Simulate file upload and create new revision
      const newRevNumber = `Rev ${String.fromCharCode(documentToSupersede.revisionNumber.charCodeAt(4) + 1)}`;
      
      // Archive the old document
      setDocuments(docs => docs.map(doc => 
        doc.id === documentToSupersede.id 
          ? { ...doc, status: 'archived' as const }
          : doc
      ));
      
      toast({
        title: "Document Superseded",
        description: `${documentToSupersede.name} has been archived. New revision ${newRevNumber} would be uploaded.`,
      });
      
      setSupersedeDialogOpen(false);
      setDocumentToSupersede(null);
    }
  };

  const filteredDocuments = (activeTab === 'current' ? currentDocuments : archivedDocuments).filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'word':
        return <FileType className="h-8 w-8 text-blue-500" />;
      case 'excel':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      default:
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

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
              <BreadcrumbPage>My documents</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-muted-foreground" />
            <h1 className="text-3xl font-bold">Documents</h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex items-center gap-3">
          <Button 
            onClick={() => navigate("/documents/new")}
            className="gap-2"
            size="lg"
          >
            <FileText className="h-4 w-4" />
            Create Document
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Pen className="h-4 w-4" />
            eSign
          </Button>
          <div className="flex-1 max-w-md ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Try ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="current" value={activeTab} onValueChange={(v) => setActiveTab(v as 'current' | 'archived')} className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Documents ({currentDocuments.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedDocuments.length})</TabsTrigger>
          </TabsList>

          {/* Current Documents Tab */}
          <TabsContent value="current" className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">001 Dennis House - Document Control Register</h2>

              {/* Documents Grid */}
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No documents found
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredDocuments.map((doc) => (
                    <Card 
                      key={doc.id}
                      className="cursor-pointer hover:shadow-md transition-all"
                      onClick={() => navigate(`/documents/editor/${doc.id}`)}
                    >
                      <CardContent className="p-5">
                        <div className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-1 flex-shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          
                          <div className="col-span-11 grid grid-cols-12 gap-3">
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Doc Number</p>
                              <p className="font-mono text-base font-medium truncate">{doc.documentNumber}</p>
                            </div>
                            
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Type</p>
                              <Badge variant="outline" className="text-sm truncate max-w-full">{doc.documentType}</Badge>
                            </div>
                            
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Document Name</p>
                              <p className="font-medium text-base truncate">{doc.name}</p>
                            </div>
                            
                            <div className="col-span-2 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                              <p className="text-base truncate">{format(new Date(doc.issueDate), "d MMM yyyy")}</p>
                            </div>
                            
                            <div className="col-span-1 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">Revision</p>
                              <Badge variant="secondary" className="text-sm truncate">{doc.revisionNumber}</Badge>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-center gap-1 min-w-0">
                              <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Avatar className="h-7 w-7 cursor-pointer flex-shrink-0">
                                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {getInitials(doc.uploaded_by)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>{doc.uploaded_by}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <div className="col-span-2 flex gap-1 items-start justify-end flex-shrink-0">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => handleViewClick(doc, e)}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Document</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => handleSupersedeClick(doc, e)}
                                    >
                                      <Upload className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Supersede with New Revision</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => handleArchiveClick(doc, e)}
                                    >
                                      <Archive className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Archive Document</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <div className="col-span-12 mt-2 pt-2 border-t">
                              <p className="text-base text-muted-foreground">
                                <span className="font-medium">Description:</span> {doc.description}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {doc.size} • {doc.fileType}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>

          {/* Archived Documents Tab */}
          <TabsContent value="archived" className="space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">Archived Documents</h2>
              <p className="text-sm text-muted-foreground mb-4">
                These documents have been superseded by newer revisions
              </p>

              {/* Documents Grid - Same as current but for archived */}
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No archived documents found
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredDocuments.map((doc) => (
                    <Card 
                      key={doc.id}
                      className="cursor-pointer hover:shadow-md transition-all opacity-75"
                      onClick={() => navigate(`/documents/editor/${doc.id}`)}
                    >
                      <CardContent className="p-5">
                        <div className="grid grid-cols-12 gap-4 items-start">
                          <div className="col-span-1 flex-shrink-0">
                            {getFileIcon(doc.type)}
                          </div>
                          
                          <div className="col-span-11 grid grid-cols-12 gap-3">
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Doc Number</p>
                              <p className="font-mono text-base font-medium">{doc.documentNumber}</p>
                            </div>
                            
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Type</p>
                              <Badge variant="outline" className="text-sm">{doc.documentType}</Badge>
                            </div>
                            
                            <div className="col-span-3">
                              <p className="text-sm text-muted-foreground mb-1">Document Name</p>
                              <p className="font-medium text-base">{doc.name}</p>
                            </div>
                            
                            <div className="col-span-2">
                              <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                              <p className="text-base">{format(new Date(doc.issueDate), "d MMM yyyy")}</p>
                            </div>
                            
                            <div className="col-span-1">
                              <p className="text-sm text-muted-foreground mb-1">Revision</p>
                              <Badge variant="secondary" className="text-sm">{doc.revisionNumber}</Badge>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Avatar className="h-7 w-7 cursor-pointer">
                                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                        {getInitials(doc.uploaded_by)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent>{doc.uploaded_by}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <div className="col-span-2 flex gap-1 items-start justify-end">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => handleViewClick(doc, e)}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View Document</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="px-2"
                                      onClick={(e) => handleDeleteClick(doc, e)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Permanently</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <div className="col-span-12 mt-2 pt-2 border-t">
                              <p className="text-base text-muted-foreground">
                                <span className="font-medium">Description:</span> {doc.description}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {doc.size} • {doc.fileType}
                                {doc.supersededBy && <span className="ml-2 text-destructive">• Superseded</span>}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </TabsContent>
        </Tabs>

        {/* Document Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {documentToPreview && getFileIcon(documentToPreview.type)}
                {documentToPreview?.name}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                <span className="font-mono">{documentToPreview?.documentNumber}</span>
                <Badge variant="outline">{documentToPreview?.revisionNumber}</Badge>
                <span>•</span>
                <span>{documentToPreview?.size}</span>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto border rounded-lg bg-muted/30 p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 rounded-lg bg-background border flex items-center justify-center">
                  {documentToPreview && getFileIcon(documentToPreview.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Document Preview</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {documentToPreview?.description}
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                    <Button onClick={() => setPreviewDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Archive Document Dialog */}
        <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                Archive Document
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2">
                <p className="font-semibold text-foreground">
                  Archive "{documentToArchive?.name}"?
                </p>
                <p>
                  This document will be moved to the archived documents section. You can still view and download it from the archive, or permanently delete it later if needed.
                </p>
                <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                  <p><span className="font-medium">Document Number:</span> {documentToArchive?.documentNumber}</p>
                  <p><span className="font-medium">Revision:</span> {documentToArchive?.revisionNumber}</p>
                  <p><span className="font-medium">Type:</span> {documentToArchive?.documentType}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmArchive}>
                Archive Document
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Delete Document
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2">
                <p className="font-semibold text-foreground">
                  Are you sure you want to delete "{documentToDelete?.name}"?
                </p>
                <p>
                  This document will be permanently removed from this project and all related areas. This action cannot be undone.
                </p>
                <p className="text-sm text-muted-foreground">
                  Note: This will affect any references to this document in project communications, plans, or other linked areas.
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleConfirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Document
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Supersede Document Dialog */}
        <AlertDialog open={supersedeDialogOpen} onOpenChange={setSupersedeDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Supersede Document
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2">
                <p className="font-semibold text-foreground">
                  Upload a new revision for "{documentToSupersede?.name}"?
                </p>
                <p>
                  The current version ({documentToSupersede?.revisionNumber}) will be moved to the archive. You'll be able to upload the new revision after confirming.
                </p>
                <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
                  <p><span className="font-medium">Document Number:</span> {documentToSupersede?.documentNumber}</p>
                  <p><span className="font-medium">Current Revision:</span> {documentToSupersede?.revisionNumber}</p>
                  <p><span className="font-medium">Type:</span> {documentToSupersede?.documentType}</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSupersede}>
                Archive & Upload New Revision
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Documents;
