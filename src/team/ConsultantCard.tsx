import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Consultant, QuoteStatus, ShortlistedConsultant } from '@/types/team';
import { Plus, Check, User, Phone, MessageCircle, Mail, FileText, Briefcase, HardHat, Ruler, Shield, Building2, Droplet, Info, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { ConsultantBriefEditor } from './ConsultantBriefEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ConsultantCardProps {
  consultant: Consultant;
  onFind: (consultant: Consultant) => void;
  onAdd: (consultant: Consultant) => void;
  onContact?: (consultant: Consultant) => void;
  onProfile?: (consultant: Consultant) => void;
  onManageTeam?: (consultant: Consultant) => void;
  onPostTask?: (consultant: Consultant) => void;
  isManaging?: boolean;
  shortlistedConsultants?: ShortlistedConsultant[];
  onQuoteStatusChange?: (role: string, company: string, status: QuoteStatus) => void;
  onMessageClick?: (company: string, role?: string) => void;
  onProfileClick?: (company: string) => void;
  onBriefUpdate?: (consultantId: string, brief: string) => void;
  onDelete?: () => void;
  onClone?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const getRoleIcon = (role: string) => {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('designer') || roleLower.includes('architect')) return Briefcase;
  if (roleLower.includes('engineer')) return HardHat;
  if (roleLower.includes('surveyor')) return Ruler;
  if (roleLower.includes('bushfire')) return Shield;
  if (roleLower.includes('certifier')) return Building2;
  if (roleLower.includes('wastewater') || roleLower.includes('water')) return Droplet;
  return Briefcase;
};

export const ConsultantCard = ({ 
  consultant, 
  onFind, 
  onAdd, 
  onContact, 
  onProfile, 
  onManageTeam,
  onPostTask,
  isManaging,
  shortlistedConsultants = [],
  onQuoteStatusChange,
  onMessageClick,
  onProfileClick,
  onBriefUpdate,
  onDelete,
  onClone,
  onMoveUp,
  onMoveDown
}: ConsultantCardProps) => {
  const [showBrief, setShowBrief] = useState(false);
  const RoleIcon = getRoleIcon(consultant.role);
  
  const getQuoteStatusLabel = (status: QuoteStatus) => {
    const labels: Record<QuoteStatus, string> = {
      'not-contacted': 'Not Contacted',
      'contacted': 'Contacted',
      'awaiting-quote': 'Awaiting Quote',
      'quote-received': 'Quote Received',
      'quote-accepted': 'Quote Accepted',
      'declined': 'Declined',
      'rejected': 'Rejected'
    };
    return labels[status];
  };

  const getQuoteStatusColor = (status: QuoteStatus) => {
    switch (status) {
      case 'quote-accepted': return 'bg-success/10 text-success border-success/20';
      case 'quote-received': return 'bg-primary/10 text-primary border-primary/20';
      case 'awaiting-quote': return 'bg-warning/10 text-warning border-warning/20';
      case 'contacted': return 'bg-info/10 text-info border-info/20';
      case 'declined':
      case 'rejected': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };
  const getStatusColor = () => {
    switch (consultant.status) {
      case 'required':
        return 'text-primary';
      case 'assigned':
        return 'text-success';
      case 'optional':
        return 'text-muted-foreground';
      case 'not-required':
        return 'text-muted-foreground/50';
      default:
        return '';
    }
  };

  const getStatusText = () => {
    switch (consultant.status) {
      case 'required':
        return 'Required';
      case 'assigned':
        return 'Assigned';
      case 'optional':
        return 'Optional';
      case 'not-required':
        return 'Not Required';
      default:
        return '';
    }
  };

  const isDisabled = consultant.status === 'not-required';
  const isAssigned = consultant.status === 'assigned';

  const shortlistedCount = shortlistedConsultants.length;
  
  // Calculate metrics
  const proposalsCount = shortlistedConsultants.filter(s => 
    ['quote-received', 'quote-accepted', 'awaiting-quote'].includes(s.quoteStatus)
  ).length;
  const messagesCount = shortlistedConsultants.filter(s => s.hasUnreadMessages).length;
  const hiredCount = shortlistedConsultants.filter(s => s.quoteStatus === 'quote-accepted').length;

  return (
    <div className="space-y-2">
      <div
        className={`flex items-center justify-between p-3 rounded-lg border bg-card transition-all ${
          isDisabled ? 'opacity-50' : 'hover:shadow-md'
        } ${isAssigned ? 'ring-2 ring-primary shadow-md' : ''}`}
      >
      <div className="flex items-center gap-2 flex-1">
        <div className="flex flex-col gap-0.5">
          {onMoveUp && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveUp}
              className="h-5 w-5 p-0"
            >
              <ChevronUp className="h-3 w-3" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
              className="h-5 w-5 p-0"
            >
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
        </div>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <RoleIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {consultant.category && (
              <Badge variant="outline" className="text-sm px-2 py-0.5">
                {consultant.category}
              </Badge>
            )}
            <h3 className="text-base font-medium text-card-foreground">{consultant.role}</h3>
            {isAssigned && <Check className="h-3.5 w-3.5 text-success" />}
            {(consultant.whyNeeded || consultant.whenNeeded) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {consultant.whyNeeded && (
                      <div className="mb-2">
                        <p className="font-semibold text-xs">Why needed:</p>
                        <p className="text-xs">{consultant.whyNeeded}</p>
                      </div>
                    )}
                    {consultant.whenNeeded && (
                      <div>
                        <p className="font-semibold text-xs">When needed:</p>
                        <p className="text-xs">{consultant.whenNeeded}</p>
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <p className={`text-sm ${getStatusColor()}`}>{getStatusText()}</p>
          {consultant.company && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {consultant.company}
              {consultant.rating && ` • ${consultant.rating}⭐`}
            </p>
          )}
          {consultant.notes && (
            <p className="text-sm text-muted-foreground mt-0.5 italic">
              {consultant.notes}
            </p>
          )}
          {isAssigned && shortlistedCount > 0 && (
            <div className="flex gap-3 mt-1.5">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Proposals:</span>
                <span className="text-sm font-semibold text-foreground">{proposalsCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Messages:</span>
                <span className="text-sm font-semibold text-foreground">{messagesCount}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Hired:</span>
                <span className="text-sm font-semibold text-foreground">{hiredCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-1.5">
        {!isDisabled && !isAssigned && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBrief(!showBrief)}
              className="gap-1 h-9 px-3 text-sm"
            >
              <FileText className="h-4 w-4" />
              Brief
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManageTeam?.(consultant)}
              className="gap-1 h-9 px-3 text-sm"
            >
              Manage Contacts
            </Button>
            <Button
              size="sm"
              onClick={() => onFind(consultant)}
              className="gap-1 h-9 px-3 text-sm"
            >
              Find
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClone}
              className="gap-1 h-8 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="gap-1 h-8 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
        {isAssigned && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBrief(!showBrief)}
              className="gap-1 h-9 px-3 text-sm"
            >
              <FileText className="h-4 w-4" />
              Brief
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPostTask?.(consultant)}
              className="gap-1 h-9 px-3 text-sm"
            >
              Post Task
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onManageTeam?.(consultant)}
              className="gap-1 h-9 px-3 text-sm"
            >
              Manage Contacts
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClone}
              className="gap-1 h-8 px-2"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="gap-1 h-8 px-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </div>

    {/* Brief Editor Section */}
    {showBrief && (
      <div className="ml-4 mt-2">
        <ConsultantBriefEditor
          role={consultant.role}
          currentBrief={consultant.brief || ''}
          onAccept={(newBrief) => {
            onBriefUpdate?.(consultant.id, newBrief);
            setShowBrief(false);
          }}
          onClose={() => setShowBrief(false)}
        />
      </div>
    )}

    {/* Expanded Manage Team Section */}
    {isManaging && shortlistedConsultants.length > 0 && (
      <div className="ml-4 p-3 rounded-lg border bg-muted/50">
        <h4 className="text-base font-medium mb-2">Shortlisted for {consultant.role}</h4>
        <div className="space-y-2">
          {shortlistedConsultants.map((shortlisted, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-card border space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RoleIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium">{shortlisted.companyName}</p>
                  <p className="text-sm text-muted-foreground">Added to team</p>
                </div>
                <Check className="h-4 w-4 text-success" />
              </div>
              
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onProfileClick?.(shortlisted.companyName)}
                  className="flex-1 gap-1 h-9 px-3 text-sm"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onMessageClick?.(shortlisted.companyName, consultant.role)}
                  className="flex-1 gap-1 h-9 px-3 text-sm relative"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message
                  {shortlisted.hasUnreadMessages && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      <Mail className="h-2 w-2" />
                    </Badge>
                  )}
                </Button>
                
                <Select 
                  value={shortlisted.quoteStatus}
                  onValueChange={(value) => onQuoteStatusChange?.(consultant.role, shortlisted.companyName, value as QuoteStatus)}
                >
                  <SelectTrigger className={`flex-1 h-9 text-sm ${getQuoteStatusColor(shortlisted.quoteStatus)}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-contacted">{getQuoteStatusLabel('not-contacted')}</SelectItem>
                    <SelectItem value="contacted">{getQuoteStatusLabel('contacted')}</SelectItem>
                    <SelectItem value="awaiting-quote">{getQuoteStatusLabel('awaiting-quote')}</SelectItem>
                    <SelectItem value="quote-received">{getQuoteStatusLabel('quote-received')}</SelectItem>
                    <SelectItem value="quote-accepted">{getQuoteStatusLabel('quote-accepted')}</SelectItem>
                    <SelectItem value="declined">{getQuoteStatusLabel('declined')}</SelectItem>
                    <SelectItem value="rejected">{getQuoteStatusLabel('rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  );
};
