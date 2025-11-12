import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CRMDeal, DealStage } from "@/types/crm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateDealDialog } from "./CreateDealDialog";

const STAGES: { value: DealStage; label: string; color: string }[] = [
  { value: 'lead', label: 'Lead', color: 'bg-slate-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-yellow-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { value: 'won', label: 'Won', color: 'bg-green-500' },
  { value: 'lost', label: 'Lost', color: 'bg-red-500' },
];

interface PipelineKanbanProps {
  onRefresh?: () => void;
}

export function PipelineKanban({ onRefresh }: PipelineKanbanProps) {
  const { toast } = useToast();
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('crm_deals')
        .select(`
          *,
          contact:crm_contacts(*)
        `)
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeals((data || []) as CRMDeal[]);
    } catch (error: any) {
      toast({
        title: "Error loading deals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDealCreated = () => {
    fetchDeals();
    if (onRefresh) onRefresh();
  };

  const updateDealStage = async (dealId: string, newStage: DealStage) => {
    try {
      const { error } = await supabase
        .from('crm_deals')
        .update({ 
          stage: newStage,
          actual_close_date: ['won', 'lost'].includes(newStage) ? new Date().toISOString() : null
        })
        .eq('id', dealId);

      if (error) throw error;

      toast({
        title: "Deal updated",
        description: `Deal moved to ${newStage}`,
      });

      fetchDeals();
      if (onRefresh) onRefresh();
    } catch (error: any) {
      toast({
        title: "Error updating deal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sales Pipeline</h2>
        <Button onClick={() => setCreateDialogOpen(true)}>Create Deal</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {STAGES.map(stage => {
          const stageDeals = getDealsByStage(stage.value);
          const totalValue = stageDeals.reduce((sum, deal) => sum + (deal.deal_value || 0), 0);

          return (
            <div key={stage.value} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                  <h3 className="font-semibold">{stage.label}</h3>
                </div>
                <Badge variant="secondary">{stageDeals.length}</Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                ${totalValue.toLocaleString()}
              </div>

              <div className="space-y-2">
                {stageDeals.map(deal => (
                  <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">{deal.deal_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2">
                      {deal.contact && (
                        <div className="text-xs text-muted-foreground">
                          {deal.contact.full_name}
                        </div>
                      )}
                      {deal.deal_value && (
                        <div className="flex items-center gap-1 text-xs">
                          <DollarSign className="h-3 w-3" />
                          {deal.deal_value.toLocaleString()}
                        </div>
                      )}
                      {deal.expected_close_date && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(deal.expected_close_date).toLocaleDateString()}
                        </div>
                      )}
                      {deal.probability !== undefined && (
                        <div className="flex items-center gap-1 text-xs">
                          <TrendingUp className="h-3 w-3" />
                          {deal.probability}% probability
                        </div>
                      )}

                      <div className="flex gap-1 flex-wrap mt-2">
                        {STAGES.filter(s => s.value !== stage.value).map(targetStage => (
                          <Button
                            key={targetStage.value}
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => updateDealStage(deal.id, targetStage.value)}
                          >
                            → {targetStage.label}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <CreateDealDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onDealCreated={handleDealCreated}
      />
    </div>
  );
}
