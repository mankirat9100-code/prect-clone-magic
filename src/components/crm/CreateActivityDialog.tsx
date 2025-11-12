import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CRMContact, CRMDeal, ActivityType } from "@/types/crm";

interface CreateActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivityCreated: () => void;
  preselectedContactId?: string;
  preselectedDealId?: string;
}

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: 'call', label: 'Phone Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'task', label: 'Task' },
  { value: 'note', label: 'Note' },
];

export function CreateActivityDialog({ 
  open, 
  onOpenChange, 
  onActivityCreated,
  preselectedContactId,
  preselectedDealId 
}: CreateActivityDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [formData, setFormData] = useState({
    activity_type: 'note' as ActivityType,
    subject: '',
    description: '',
    contact_id: preselectedContactId || '',
    deal_id: preselectedDealId || '',
    due_date: '',
    meeting_date: '',
    duration_minutes: '',
    location: '',
  });

  useEffect(() => {
    if (open) {
      fetchContacts();
      fetchDeals();
      if (preselectedContactId) {
        setFormData(prev => ({ ...prev, contact_id: preselectedContactId }));
      }
      if (preselectedDealId) {
        setFormData(prev => ({ ...prev, deal_id: preselectedDealId }));
      }
    }
  }, [open, preselectedContactId, preselectedDealId]);

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

  const fetchDeals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('crm_deals')
      .select('*')
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
      .order('deal_name');

    if (data) setDeals(data as CRMDeal[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject) {
      toast({
        title: "Missing information",
        description: "Please provide a subject",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const activityData: any = {
        activity_type: formData.activity_type,
        subject: formData.subject,
        description: formData.description || null,
        contact_id: formData.contact_id || null,
        deal_id: formData.deal_id || null,
        created_by: user.id,
      };

      if (formData.activity_type === 'task' && formData.due_date) {
        activityData.due_date = formData.due_date;
        activityData.status = 'pending';
      }

      if (formData.activity_type === 'meeting') {
        if (formData.meeting_date) activityData.meeting_date = formData.meeting_date;
        if (formData.duration_minutes) activityData.duration_minutes = parseInt(formData.duration_minutes);
        if (formData.location) activityData.location = formData.location;
      }

      if (formData.activity_type === 'email') {
        activityData.email_sent_at = new Date().toISOString();
      }

      const { error } = await supabase.from('crm_activities').insert(activityData);

      if (error) throw error;

      toast({
        title: "Activity logged",
        description: "The activity has been recorded successfully",
      });

      onActivityCreated();
      onOpenChange(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Error logging activity",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      activity_type: 'note',
      subject: '',
      description: '',
      contact_id: '',
      deal_id: '',
      due_date: '',
      meeting_date: '',
      duration_minutes: '',
      location: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="activity_type">Activity Type</Label>
              <Select
                value={formData.activity_type}
                onValueChange={(value: ActivityType) => setFormData(prev => ({ ...prev, activity_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="e.g., Follow-up call"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_id">Contact</Label>
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
                      {contact.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deal_id">Deal (Optional)</Label>
              <Select
                value={formData.deal_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deal_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select deal" />
                </SelectTrigger>
                <SelectContent>
                  {deals.map(deal => (
                    <SelectItem key={deal.id} value={deal.id}>
                      {deal.deal_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.activity_type === 'task' && (
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="datetime-local"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            )}

            {formData.activity_type === 'meeting' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="meeting_date">Meeting Date</Label>
                  <Input
                    id="meeting_date"
                    type="datetime-local"
                    value={formData.meeting_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, meeting_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                  <Input
                    id="duration_minutes"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: e.target.value }))}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Office, Video call, etc."
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Activity details..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging..." : "Log Activity"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
