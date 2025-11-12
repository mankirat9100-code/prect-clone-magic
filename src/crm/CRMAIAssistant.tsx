import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CRMAIAssistantProps {
  onFilterChange?: (filter: string) => void;
}

export function CRMAIAssistant({ onFilterChange }: CRMAIAssistantProps) {
  return (
    <div className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 border-2 border-border shadow-lg">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
      <div className="relative flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full flex gap-3 bg-background rounded-xl p-3 shadow-sm border border-border">
          <Input
            type="text"
            placeholder="Ask Trevor anything about your clients, deals, or projects…"
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
          />
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Mic className="h-5 w-5 text-primary" />
          </Button>
        </div>
        <Select defaultValue="all" onValueChange={onFilterChange}>
          <SelectTrigger className="w-full md:w-[180px] bg-background border-border">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="leads">Leads</SelectItem>
            <SelectItem value="projects">Projects</SelectItem>
            <SelectItem value="contacts">Contacts</SelectItem>
            <SelectItem value="tasks">Tasks</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
