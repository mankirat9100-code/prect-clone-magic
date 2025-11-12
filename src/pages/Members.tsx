import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Mail, Phone, Building2, MoreVertical, Shield, Eye, Edit, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockMembers = [
  {
    id: 1,
    name: "Joshua Dennis",
    memberType: "internal",
    externalRole: null,
    permissionLevel: "admin",
    email: "joshua@example.com",
    phone: "+61 400 123 456",
    company: "Project Builder Co",
    status: "Active",
    avatar: "JD",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    memberType: "internal",
    externalRole: null,
    permissionLevel: "editor",
    email: "sarah@example.com",
    phone: "+61 400 234 567",
    company: "Project Builder Co",
    status: "Active",
    avatar: "SJ",
  },
  {
    id: 3,
    name: "Mike Williams",
    memberType: "external",
    externalRole: "builder",
    permissionLevel: "viewer",
    email: "mike@example.com",
    phone: "+61 400 345 678",
    company: "Williams Construction",
    status: "Active",
    avatar: "MW",
  },
  {
    id: 4,
    name: "Emma Davis",
    memberType: "external",
    externalRole: "client",
    permissionLevel: "viewer",
    email: "emma@example.com",
    phone: "+61 400 456 789",
    company: "Davis Enterprises",
    status: "Active",
    avatar: "ED",
  },
  {
    id: 5,
    name: "John Certifier",
    memberType: "external",
    externalRole: "certifier",
    permissionLevel: "viewer",
    email: "john@certify.com",
    phone: "+61 400 567 890",
    company: "Certify Australia",
    status: "Active",
    avatar: "JC",
  },
  {
    id: 6,
    name: "Lisa Consultant",
    memberType: "external",
    externalRole: "consultant",
    permissionLevel: "editor",
    email: "lisa@consult.com",
    phone: "+61 400 678 901",
    company: "Expert Consultants",
    status: "Active",
    avatar: "LC",
  },
];

const getPermissionIcon = (level: string) => {
  switch (level) {
    case "admin":
      return <UserCog className="h-4 w-4" />;
    case "editor":
      return <Edit className="h-4 w-4" />;
    case "viewer":
      return <Eye className="h-4 w-4" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

const getPermissionColor = (level: string) => {
  switch (level) {
    case "admin":
      return "bg-purple-500/10 text-purple-700 border-purple-500/20";
    case "editor":
      return "bg-blue-500/10 text-blue-700 border-blue-500/20";
    case "viewer":
      return "bg-gray-500/10 text-gray-700 border-gray-500/20";
    default:
      return "";
  }
};

const Members = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Team Members
            </h1>
            <p className="text-muted-foreground text-lg">
              View and manage all project team members
            </p>
          </div>
          <Button size="lg">
            <Users className="mr-2 h-5 w-5" />
            Add Member
          </Button>
        </div>

        {/* Members Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Member</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Permission</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {member.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <Badge variant={member.memberType === "internal" ? "default" : "secondary"} className="w-fit">
                          {member.memberType === "internal" ? "Internal" : "External"}
                        </Badge>
                        {member.externalRole && (
                          <Badge variant="outline" className="capitalize w-fit">
                            {member.externalRole}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{member.email}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{member.phone}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{member.company}</td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className={`flex items-center gap-1 w-fit ${getPermissionColor(member.permissionLevel)}`}>
                        {getPermissionIcon(member.permissionLevel)}
                        <span className="capitalize">{member.permissionLevel}</span>
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                        {member.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card z-50">
                          <DropdownMenuItem>Edit Member</DropdownMenuItem>
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Members;
