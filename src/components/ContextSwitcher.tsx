import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building2, User, ChevronDown, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ContextSwitcher() {
  const { toast } = useToast();
  const [currentContext, setCurrentContext] = useState<"individual" | "business">("individual");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContext();
    fetchBusinesses();
  }, []);

  const fetchContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: context } = await supabase
        .from("user_context")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (context) {
        setCurrentContext(context.context_type as "individual" | "business");
      }
    } catch (error) {
      console.error("Error fetching context:", error);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        setBusinesses(data);
      }
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  const switchContext = async (type: "individual" | "business", businessId?: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_context")
        .upsert({
          user_id: user.id,
          context_type: type,
          business_id: businessId || null,
        });

      if (error) throw error;

      setCurrentContext(type);
      toast({
        title: "Context switched",
        description: `Now operating as ${type === "individual" ? "individual" : "business"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          {currentContext === "individual" ? (
            <User className="h-4 w-4" />
          ) : (
            <Building2 className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">
            {currentContext === "individual" ? "Individual" : "Business"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch Context</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => switchContext("individual")}
          disabled={loading}
          className="gap-2"
        >
          <User className="h-4 w-4" />
          <span>Individual</span>
          {currentContext === "individual" && <Check className="h-4 w-4 ml-auto" />}
        </DropdownMenuItem>
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <DropdownMenuItem
              key={business.id}
              onClick={() => switchContext("business", business.id)}
              disabled={loading}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span>{business.business_name}</span>
              {currentContext === "business" && <Check className="h-4 w-4 ml-auto" />}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled className="text-muted-foreground">
            No business profiles
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
