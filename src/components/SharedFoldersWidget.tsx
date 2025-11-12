import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FolderOpen,
  FileText,
  Search,
  Download,
  Plus,
  ExternalLink,
  Cloud,
  FolderSync,
  ChevronRight,
  Home,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type DriveProvider = "google" | "onedrive" | null;

type DriveFile = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string;
  size?: number;
  modifiedDate: string;
  mimeType?: string;
};

type BreadcrumbItem = {
  id: string;
  name: string;
};

export const SharedFoldersWidget = () => {
  const { toast } = useToast();
  const [connectedProvider, setConnectedProvider] = useState<DriveProvider>(null);
  const [showBrowser, setShowBrowser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<string>("root");
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [fileDescription, setFileDescription] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: "root", name: "My Drive" }
  ]);

  // Mock data - will be replaced with real API calls
  // Complete folder structure with nested files
  const allMockFiles: DriveFile[] = [
    // Root level folders and files
    {
      id: "folder-1",
      name: "Dennis Partners House - Plans",
      type: "folder",
      parentId: "root",
      modifiedDate: "2024-03-15",
    },
    {
      id: "folder-2",
      name: "Structural Engineering Reports",
      type: "folder",
      parentId: "root",
      modifiedDate: "2024-03-10",
    },
    {
      id: "folder-3",
      name: "2024 Projects Archive",
      type: "folder",
      parentId: "root",
      modifiedDate: "2024-01-05",
    },
    {
      id: "file-root-1",
      name: "Company_Overview.pdf",
      type: "file",
      parentId: "root",
      size: 1200000,
      modifiedDate: "2024-03-20",
      mimeType: "application/pdf",
    },
    
    // Inside "Dennis Partners House - Plans" folder
    {
      id: "folder-1-1",
      name: "Architectural Drawings",
      type: "folder",
      parentId: "folder-1",
      modifiedDate: "2024-03-15",
    },
    {
      id: "folder-1-2",
      name: "Engineering Documents",
      type: "folder",
      parentId: "folder-1",
      modifiedDate: "2024-03-14",
    },
    {
      id: "file-1-1",
      name: "Site_Plan_v3.pdf",
      type: "file",
      parentId: "folder-1",
      size: 3400000,
      modifiedDate: "2024-03-15",
      mimeType: "application/pdf",
    },
    {
      id: "file-1-2",
      name: "Floor_Plans_Final.pdf",
      type: "file",
      parentId: "folder-1",
      size: 5200000,
      modifiedDate: "2024-03-14",
      mimeType: "application/pdf",
    },
    
    // Inside "Architectural Drawings" subfolder
    {
      id: "file-1-1-1",
      name: "Ground_Floor_Layout.dwg",
      type: "file",
      parentId: "folder-1-1",
      size: 8500000,
      modifiedDate: "2024-03-15",
      mimeType: "application/acad",
    },
    {
      id: "file-1-1-2",
      name: "First_Floor_Layout.dwg",
      type: "file",
      parentId: "folder-1-1",
      size: 7800000,
      modifiedDate: "2024-03-15",
      mimeType: "application/acad",
    },
    {
      id: "file-1-1-3",
      name: "Elevation_Views.pdf",
      type: "file",
      parentId: "folder-1-1",
      size: 4100000,
      modifiedDate: "2024-03-14",
      mimeType: "application/pdf",
    },
    
    // Inside "Engineering Documents" subfolder
    {
      id: "file-1-2-1",
      name: "Structural_Calculations.pdf",
      type: "file",
      parentId: "folder-1-2",
      size: 2800000,
      modifiedDate: "2024-03-14",
      mimeType: "application/pdf",
    },
    {
      id: "file-1-2-2",
      name: "Foundation_Report.pdf",
      type: "file",
      parentId: "folder-1-2",
      size: 3200000,
      modifiedDate: "2024-03-13",
      mimeType: "application/pdf",
    },
    
    // Inside "Structural Engineering Reports" folder
    {
      id: "file-2-1",
      name: "Soil_Analysis_Report.pdf",
      type: "file",
      parentId: "folder-2",
      size: 4500000,
      modifiedDate: "2024-03-10",
      mimeType: "application/pdf",
    },
    {
      id: "file-2-2",
      name: "Load_Bearing_Assessment.pdf",
      type: "file",
      parentId: "folder-2",
      size: 2100000,
      modifiedDate: "2024-03-09",
      mimeType: "application/pdf",
    },
    {
      id: "file-2-3",
      name: "Wind_Load_Analysis.xlsx",
      type: "file",
      parentId: "folder-2",
      size: 850000,
      modifiedDate: "2024-03-08",
      mimeType: "application/vnd.ms-excel",
    },
    
    // Inside "2024 Projects Archive" folder
    {
      id: "folder-3-1",
      name: "Q1 Projects",
      type: "folder",
      parentId: "folder-3",
      modifiedDate: "2024-01-05",
    },
    {
      id: "file-3-1",
      name: "Budget_Summary_2024.xlsx",
      type: "file",
      parentId: "folder-3",
      size: 450000,
      modifiedDate: "2024-01-05",
      mimeType: "application/vnd.ms-excel",
    },
  ];

  // Get files for current folder
  const currentFolderFiles = searchQuery
    ? allMockFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allMockFiles.filter((file) => file.parentId === currentFolder);

  const navigateToFolder = (folderId: string, folderName: string) => {
    setCurrentFolder(folderId);
    
    if (folderId === "root") {
      setBreadcrumbs([{ id: "root", name: "My Drive" }]);
    } else {
      // Add to breadcrumbs if not already there
      const existingIndex = breadcrumbs.findIndex(b => b.id === folderId);
      if (existingIndex >= 0) {
        // Clicked on a breadcrumb - go back
        setBreadcrumbs(breadcrumbs.slice(0, existingIndex + 1));
      } else {
        // Going into a new folder
        setBreadcrumbs([...breadcrumbs, { id: folderId, name: folderName }]);
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleConnect = (provider: DriveProvider) => {
    // In production, this would trigger OAuth flow
    setConnectedProvider(provider);
    toast({
      title: `${provider === "google" ? "Google Drive" : "OneDrive"} Connected`,
      description: "You can now browse and import files from your drive",
    });
    setShowBrowser(true);
  };

  const handleDisconnect = () => {
    setConnectedProvider(null);
    setShowBrowser(false);
    toast({
      title: "Drive Disconnected",
      description: "Your cloud storage has been disconnected",
    });
  };

  const handleImportFile = (destination: string) => {
    if (!selectedFile || !destination) return;

    const wordCount = fileDescription.trim().split(/\s+/).filter(w => w.length > 0).length;
    if (wordCount > 15) {
      toast({
        title: "Description too long",
        description: "Please keep the description to 15 words or less",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "File Imported",
      description: `${selectedFile.name} has been added to ${destination}${fileDescription ? ' with description' : ''}`,
    });
    setShowImportDialog(false);
    setSelectedFile(null);
    setFileDescription("");
  };

  const importDestinations = [
    { value: "documents", label: "Documents" },
    { value: "costing", label: "Costing" },
    { value: "planning", label: "Planning" },
    { value: "council", label: "Council" },
    { value: "team", label: "Team Briefs" },
  ];

  if (!connectedProvider) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderSync className="h-5 w-5" />
            Shared Folders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your cloud storage to browse, search, and import files directly into your project
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => handleConnect("google")}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Cloud className="h-4 w-4" />
              Connect Google Drive
            </Button>
            <Button
              onClick={() => handleConnect("onedrive")}
              variant="outline"
              className="w-full justify-start gap-2"
            >
              <Cloud className="h-4 w-4" />
              Connect OneDrive
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderSync className="h-5 w-5" />
              Shared Folders
            </CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Cloud className="h-3 w-3" />
              {connectedProvider === "google" ? "Google Drive" : "OneDrive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm overflow-x-auto pb-2">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => navigateToFolder(crumb.id, crumb.name)}
                  >
                    {index === 0 ? <Home className="h-3 w-3 mr-1" /> : null}
                    {crumb.name}
                  </Button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Files List */}
            <ScrollArea className="h-[350px]">
              <div className="space-y-2">
                {currentFolderFiles.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      {searchQuery ? "No files found" : "This folder is empty"}
                    </p>
                  </div>
                ) : (
                  currentFolderFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {file.type === "folder" ? (
                        <FolderOpen className="h-5 w-5 text-primary flex-shrink-0" />
                      ) : (
                        <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{file.modifiedDate}</span>
                          {file.size && <span>{formatFileSize(file.size)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.type === "file" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              toast({
                                title: "Opening file",
                                description: `Opening ${file.name}...`,
                              });
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(file);
                              setShowImportDialog(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Import
                          </Button>
                        </>
                      )}
                      {file.type === "folder" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigateToFolder(file.id, file.name)}
                        >
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBrowser(!showBrowser)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                {showBrowser ? "Close Browser" : "Open Browser"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={(open) => {
        setShowImportDialog(open);
        if (!open) {
          setFileDescription("");
          setSelectedFile(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <p className="text-sm font-medium mb-1">File:</p>
              <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
              {selectedFile?.size && (
                <p className="text-xs text-muted-foreground mt-1">
                  Size: {formatFileSize(selectedFile.size)}
                </p>
              )}
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Description:</p>
              <Textarea
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                placeholder="Add a brief description (max 15 words)..."
                className="min-h-[60px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {fileDescription.trim().split(/\s+/).filter(w => w.length > 0).length}/15 words
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Import to:</p>
              <Select onValueChange={handleImportFile}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent className="bg-background">
                  {importDestinations.map((dest) => (
                    <SelectItem key={dest.value} value={dest.value}>
                      {dest.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
