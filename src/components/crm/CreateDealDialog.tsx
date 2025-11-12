import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CRMContact, DealStage } from "@/types/crm";

interface CreateDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealCreated: () => void;
  preselectedContactId?: string;
}

const STAGES: { value: DealStage; label: string }[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'negotiation', label: 'Negotiation' },
];

export function CreateDealDialog({ open, onOpenChange, onDealCreated, preselectedContactId }: CreateDealDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [formData, setFormData] = useState({
    deal_name: '',
    contact_id: preselectedContactId || '',
    deal_value: '',
    stage: 'lead' as DealStage,
    probability: '10',
    expected_close_date: '',
    description: '',
  });

  useEffect(() => {
    if (open) {
      fetchContacts();
      if (preselectedContactId) {
        setFormData(prev => ({ ...prev, contact_id: preselectedContactId }));
      }
    }
  }, [open, preselectedContactId]);

  const fetchContacts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('crm_contacts')
      .select('*')
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
      .order('full_name');

    if (data) setContacts(data as CRMContact[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deal_name || !formData.contact_id) {
      toast({
        title: "Missing information",
        description: "Please fill in deal name and select a contact",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from('crm_deals').insert({
        deal_name: formData.deal_name,
        contact_id: formData.contact_id,
        deal_value: formData.deal_value ? parseFloat(formData.deal_value) : null,
        stage: formData.stage,
        probability: parseInt(formData.probability),
        expected_close_date: formData.expected_close_date || null,
        description: formData.description || null,
        created_by: user.id,
      });

      if (error) throw error;

      toast({
        title: "Deal created",
        description: "The deal has been created successfully",
      });

      onDealCreated();
      onOpenChange(false);
      setFormData({
        deal_name: '',
        contact_id: '',
        deal_value: '',
        stage: 'lead',
        probability: '10',
        expected_close_date: '',
        description: '',
      });
    } catch (error: any) {
      toast({
        title: "Error creating deal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal_name">Deal Name *</Label>
              <Input
                id="deal_name"
                value={formData.deal_name}
                onChange={(e) => setFormData(prev => ({ ...prev, deal_name: e.target.value }))}
                placeholder="e.g., Office Renovation Project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_id">Contact *</Label>
              <Select
                value={formData.contact_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contact_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.full_name} - {contact.company || contact.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deal_value">Deal Value ($)</Label>
              <Input
                id="deal_value"
                type="number"
                step="0.01"
                value={formData.deal_value}
                onChange={(e) => setFormData(prev => ({ ...prev, deal_value: e.target.value }))}
                placeholder="50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select
                value={formData.stage}
                onValueChange={(value: DealStage) => setFormData(prev => ({ ...prev, stage: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map(stage => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_close_date">Expected Close Date</Label>
              <Input
                id="expected_close_date"
                type="date"
                value={formData.expected_close_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Deal details..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Deal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
