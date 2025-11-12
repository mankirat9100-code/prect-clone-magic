import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";

interface RevenueData {
  month: string;
  revenue: number;
}

export function RevenueChart() {
  const { toast } = useToast();
  const [data, setData] = useState<RevenueData[]>([]);

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch won deals from the last 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: deals, error } = await supabase
        .from('crm_deals')
        .select('deal_value, actual_close_date')
        .eq('stage', 'won')
        .gte('actual_close_date', sixMonthsAgo.toISOString())
        .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`);

      if (error) throw error;

      // Group by month
      const revenueByMonth = new Map<string, number>();
      
      deals?.forEach(deal => {
        if (deal.actual_close_date && deal.deal_value) {
          const date = new Date(deal.actual_close_date);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          const current = revenueByMonth.get(monthLabel) || 0;
          revenueByMonth.set(monthLabel, current + deal.deal_value);
        }
      });

      const chartData = Array.from(revenueByMonth.entries()).map(([month, revenue]) => ({
        month,
        revenue,
      }));

      setData(chartData);
    } catch (error: any) {
      toast({
        title: "Error loading revenue data",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No revenue data available yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => `$${value.toLocaleString()}`}
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
