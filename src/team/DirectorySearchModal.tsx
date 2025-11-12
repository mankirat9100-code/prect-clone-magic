import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DirectoryResult } from '@/types/team';
import { Plus, Star } from 'lucide-react';

interface DirectorySearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: string;
  results: DirectoryResult[];
  onAdd: (result: DirectoryResult) => void;
}

export const DirectorySearchModal = ({
  open,
  onOpenChange,
  role,
  results,
  onAdd,
}: DirectorySearchModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Find {role}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {results.map((result) => (
            <Card key={result.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-card-foreground">{result.companyName}</h3>
                  <p className="text-sm text-muted-foreground">{result.specialty}</p>
                </div>

                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{result.rating}</span>
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground">
                    Response: <span className="text-foreground">{result.responseTime}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Location: <span className="text-foreground">{result.location}</span>
                  </p>
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    onAdd(result);
                    onOpenChange(false);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add to Project
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
