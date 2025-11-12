import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, Lock, Eye, Users, FileText, DollarSign, Calendar, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type InformationCategory = {
  id: string;
  category: string;
  description: string;
  shared_with_external: boolean;
  specific_roles: string[] | null;
};

const getCategoryIcon = (category: string) => {
  const lowerCategory = category.toLowerCase();
  if (lowerCategory.includes("financial")) return <DollarSign className="h-5 w-5" />;
  if (lowerCategory.includes("planning")) return <Calendar className="h-5 w-5" />;
  if (lowerCategory.includes("council")) return <Building2 className="h-5 w-5" />;
  if (lowerCategory.includes("team")) return <Users className="h-5 w-5" />;
  if (lowerCategory.includes("technical")) return <FileText className="h-5 w-5" />;
  return <FileText className="h-5 w-5" />;
};

const formatRoleName = (role: string) => {
  return role.charAt(0).toUpperCase() + role.slice(1);
};

const Security = () => {
  const [categories, setCategories] = useState<InformationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("information_sharing")
        .select("*")
        .order("category", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load security settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSharing = async (categoryId: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("information_sharing")
        .update({ shared_with_external: !currentValue })
        .eq("id", categoryId);

      if (error) throw error;

      setCategories(
        categories.map((cat) =>
          cat.id === categoryId
            ? { ...cat, shared_with_external: !currentValue }
            : cat
        )
      );

      toast({
        title: "Success",
        description: "Security settings updated",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        title: "Error",
        description: "Failed to update security settings",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Security & Information Sharing</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Control what information is shared with external team members
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-destructive" />
                Protected Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {categories.filter((c) => !c.shared_with_external).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Internal only
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-600" />
                Shared Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {categories.filter((c) => c.shared_with_external).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Visible to external members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Total Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Information types
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Information Sharing Table */}
        <Card>
          <CardHeader>
            <CardTitle>Information Sharing Settings</CardTitle>
            <CardDescription>
              Toggle which information categories are visible to external team members and specify which roles can access them
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading security settings...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Accessible Roles</TableHead>
                    <TableHead className="text-right">Share with External</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category.category)}
                          <span className="font-medium">{category.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description}
                      </TableCell>
                      <TableCell>
                        {category.specific_roles && category.specific_roles.length > 0 ? (
                          <div className="flex gap-1 flex-wrap">
                            {category.specific_roles.map((role) => (
                              <Badge
                                key={role}
                                variant="outline"
                                className="text-xs"
                              >
                                {formatRoleName(role)}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Internal Only
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Switch
                          checked={category.shared_with_external}
                          onCheckedChange={() =>
                            handleToggleSharing(
                              category.id,
                              category.shared_with_external
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
