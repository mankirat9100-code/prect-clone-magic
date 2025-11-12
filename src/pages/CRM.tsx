import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Target, 
  Plus, 
  Clock, 
  CheckSquare, 
  AlertCircle,
  BarChart3,
  TrendingDown,
  Award,
  Contact,
  MessageSquare,
  FolderKanban
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CRMMetrics, DealsByStage, DealStage } from "@/types/crm";
import { useNavigate } from "react-router-dom";
import { CRMAIAssistant } from "@/components/crm/CRMAIAssistant";
import { DashboardCard } from "@/components/crm/DashboardCard";
import { RecentActivityFeed } from "@/components/crm/RecentActivityFeed";
import { UpcomingDeadlines } from "@/components/crm/UpcomingDeadlines";
import { HoursTrackingTable } from "@/components/crm/HoursTrackingTable";

export default function CRM() {
  console.log('CRM page loaded');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<CRMMetrics>({
    totalContacts: 0,
    activeDeals: 0,
    pipelineValue: 0,
    winRate: 0,
    dealsWonThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [dealsByStage, setDealsByStage] = useState<DealsByStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch contacts count
      const { count: contactsCount } = await supabase
        .from('crm_contacts')
        .select('*', { count: 'exact', head: true })
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      // Fetch active deals
      const { data: activeDeals, count: activeDealsCount } = await supabase
        .from('crm_deals')
        .select('deal_value, stage', { count: 'exact' })
        .not('stage', 'in', '(won,lost)')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      // Calculate pipeline value
      const pipelineValue = activeDeals?.reduce((sum, deal) => sum + (deal.deal_value || 0), 0) || 0;

      // Fetch won/lost deals for win rate
      const { count: wonCount } = await supabase
        .from('crm_deals')
        .select('*', { count: 'exact', head: true })
        .eq('stage', 'won')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      const { count: lostCount } = await supabase
        .from('crm_deals')
        .select('*', { count: 'exact', head: true })
        .eq('stage', 'lost')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      const totalClosed = (wonCount || 0) + (lostCount || 0);
      const winRate = totalClosed > 0 ? ((wonCount || 0) / totalClosed) * 100 : 0;

      // Fetch this month's won deals
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: wonThisMonth, count: wonThisMonthCount } = await supabase
        .from('crm_deals')
        .select('deal_value', { count: 'exact' })
        .eq('stage', 'won')
        .gte('actual_close_date', startOfMonth.toISOString())
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      const revenueThisMonth = wonThisMonth?.reduce((sum, deal) => sum + (deal.deal_value || 0), 0) || 0;

      // Fetch deals by stage
      const { data: allDeals } = await supabase
        .from('crm_deals')
        .select('stage, deal_value')
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      const stageGroups = allDeals?.reduce((acc, deal) => {
        const existing = acc.find(g => g.stage === deal.stage);
        if (existing) {
          existing.count++;
          existing.value += deal.deal_value || 0;
        } else {
          acc.push({
            stage: deal.stage as DealStage,
            count: 1,
            value: deal.deal_value || 0,
          });
        }
        return acc;
      }, [] as DealsByStage[]) || [];

      setMetrics({
        totalContacts: contactsCount || 0,
        activeDeals: activeDealsCount || 0,
        pipelineValue,
        winRate: Math.round(winRate),
        dealsWonThisMonth: wonThisMonthCount || 0,
        revenueThisMonth,
      });

      setDealsByStage(stageGroups);
    } catch (error: any) {
      toast({
        title: "Error loading metrics",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-auto bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">CRM Dashboard</h1>
            
        {/* AI Assistant Bar */}
        <CRMAIAssistant />

        {/* Main Icon Cards - Like Landing Page */}
        <section className="space-y-6">
          <h2 className="sr-only">CRM Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Leads Card */}
            <div 
              onClick={() => navigate('/crm?filter=leads')}
              className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 sm:p-8 text-center border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">Leads</h3>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">45</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active leads</p>
              </div>
            </div>

            {/* Projects Card */}
            <div 
              onClick={() => navigate('/crm?filter=projects')}
              className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 sm:p-8 text-center border-2 border-border hover:border-accent/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition-colors">Projects</h3>
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">23</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Active projects</p>
              </div>
            </div>

            {/* Contacts Card */}
            <div 
              onClick={() => navigate('/contacts')}
              className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 sm:p-8 text-center border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Contact className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary transition-colors">Contacts</h3>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">{metrics.totalContacts}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total contacts</p>
              </div>
            </div>

            {/* Messages Card */}
            <div 
              onClick={() => navigate('/messages')}
              className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 sm:p-8 text-center border-2 border-border hover:border-accent/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 group-hover:text-accent transition-colors">Messages</h3>
                <div className="text-2xl sm:text-3xl font-bold text-accent mb-2">12</div>
                <p className="text-xs sm:text-sm text-muted-foreground">Unread messages</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hours Tracking Table */}
        <section className="space-y-6">
          <h2 className="sr-only">Hours Tracking</h2>
          <HoursTrackingTable />
        </section>

        {/* Two Column Section */}
        <section className="space-y-6">
          <h2 className="sr-only">Activity and Deadlines</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Recent Activity Feed */}
            <Card className="relative bg-gradient-to-br from-card to-card/50 border-2 border-border">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl" />
              <CardHeader className="relative">
                <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Recent Activity Feed
                </h3>
              </CardHeader>
              <CardContent className="relative">
                <RecentActivityFeed />
              </CardContent>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="relative bg-gradient-to-br from-card to-card/50 border-2 border-border">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <CardHeader className="relative">
                <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Upcoming Deadlines & Meetings
                </h3>
              </CardHeader>
              <CardContent className="relative">
                <UpcomingDeadlines />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Optional Widgets Row */}
        <section className="space-y-6">
          <h2 className="sr-only">Performance Metrics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Sales Funnel Snapshot */}
                <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all">
                  <CardHeader className="pb-3">
                    <h3 className="text-base font-semibold flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-primary" />
                      Sales Funnel
                    </h3>
                  </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { label: "New", count: 45, color: "bg-blue-500" },
                      { label: "Contacted", count: 32, color: "bg-purple-500" },
                      { label: "Proposal", count: 18, color: "bg-yellow-500" },
                      { label: "Won", count: 12, color: "bg-green-500" },
                    ].map((stage) => (
                      <div key={stage.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                        <span className="text-sm flex-1">{stage.label}</span>
                        <span className="text-sm font-bold">{stage.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue Summary */}
              <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-accent/50 hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    Revenue Summary
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-accent">$487,500</div>
                      <div className="text-xs text-muted-foreground">Closed this month</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 dark:text-green-400">+24% vs last month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts/Reminders */}
              <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Alerts
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 rounded bg-red-500/10 text-sm">
                      <div className="font-medium">3 overdue follow-ups</div>
                      <div className="text-xs text-muted-foreground">Action needed</div>
                    </div>
                    <div className="p-2 rounded bg-yellow-500/10 text-sm">
                      <div className="font-medium">5 proposals expiring</div>
                      <div className="text-xs text-muted-foreground">This week</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card className="bg-gradient-to-br from-card to-card/50 border-2 border-border hover:border-accent/50 hover:shadow-xl transition-all">
                <CardHeader className="pb-3">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    Top Performers
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: "John Doe", metric: "8 deals", rank: 1 },
                      { name: "Sarah Miller", metric: "42.5 hrs", rank: 2 },
                      { name: "Tom Harris", metric: "6 deals", rank: 3 },
                    ].map((performer) => (
                      <div key={performer.name} className="flex items-center gap-2 text-sm">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          performer.rank === 1 ? "bg-yellow-500 text-white" :
                          performer.rank === 2 ? "bg-gray-400 text-white" :
                          "bg-orange-600 text-white"
                        }`}>
                          {performer.rank}
                        </div>
                        <span className="flex-1">{performer.name}</span>
                        <span className="text-xs text-muted-foreground">{performer.metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        </section>

        {/* Floating Add Button */}
        <Button
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 hover:scale-110 transition-all z-20"
          onClick={() => navigate('/contacts')}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
