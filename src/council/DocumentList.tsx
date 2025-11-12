import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, FileText } from "lucide-react";
import { format } from "date-fns";

export type DocumentTag = 
  | "da-approval"
  | "da-modification"
  | "section-68"
  | "section-138"
  | "construction-certificate"
  | "engineering-plans"
  | "basix"
  | "other";

export type UploadedDocument = {
  id: string;
  name: string;
  uploadedAt: Date;
  tag?: DocumentTag;
};

type DocumentListProps = {
  documents: UploadedDocument[];
  onTagChange: (documentId: string, tag: DocumentTag) => void;
  onDelete: (documentId: string) => void;
};

const tagLabels: Record<DocumentTag, string> = {
  "da-approval": "DA Approval",
  "da-modification": "DA Modification",
  "section-68": "Section 68 Approval",
  "section-138": "Section 138 Approval",
  "construction-certificate": "Construction Certificate",
  "engineering-plans": "Engineering Plans",
  "basix": "BASIX Documentation",
  "other": "Other"
};

export const DocumentList = ({ documents, onTagChange, onDelete }: DocumentListProps) => {
  if (documents.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Documents</CardTitle>
        <CardDescription>
          Tag each document to organize your compliance documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
            >
              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{doc.name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(doc.uploadedAt, "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              <Select
                value={doc.tag}
                onValueChange={(value) => onTagChange(doc.id, value as DocumentTag)}
              >
                <SelectTrigger className="w-[240px]">
                  <SelectValue placeholder="Select document type..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(tagLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(doc.id)}
                className="flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
