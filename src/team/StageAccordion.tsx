import { ProjectStage, Consultant, ShortlistedConsultant, QuoteStatus } from '@/types/team';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ConsultantCard } from './ConsultantCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface StageAccordionProps {
  stages: ProjectStage[];
  onFind: (consultant: Consultant) => void;
  onAdd: (consultant: Consultant) => void;
  onContact?: (consultant: Consultant) => void;
  onProfile?: (consultant: Consultant) => void;
  onManageTeam?: (consultant: Consultant) => void;
  onPostTask?: (consultant: Consultant) => void;
  managingConsultantId?: string;
  shortlistedByRole?: Record<string, ShortlistedConsultant[]>;
  onQuoteStatusChange?: (role: string, company: string, status: QuoteStatus) => void;
  onMessageClick?: (company: string, role?: string) => void;
  onProfileClick?: (company: string) => void;
  onBriefUpdate?: (consultantId: string, brief: string) => void;
  onAddConsultant?: (stageId: string) => void;
  onDeleteConsultant?: (stageId: string, consultantId: string) => void;
  onCloneConsultant?: (stageId: string, consultantId: string) => void;
  onMoveConsultant?: (stageId: string, consultantId: string, direction: 'up' | 'down') => void;
}

export const StageAccordion = ({ 
  stages, 
  onFind, 
  onAdd, 
  onContact, 
  onProfile,
  onManageTeam,
  onPostTask,
  managingConsultantId,
  shortlistedByRole = {},
  onQuoteStatusChange,
  onMessageClick,
  onProfileClick,
  onBriefUpdate,
  onAddConsultant,
  onDeleteConsultant,
  onCloneConsultant,
  onMoveConsultant
}: StageAccordionProps) => {
  return (
    <Accordion type="multiple" defaultValue={stages.map((s) => s.id)} className="space-y-4">
      {stages.map((stage) => (
        <AccordionItem
          key={stage.id}
          value={stage.id}
          className="border rounded-lg bg-card shadow-sm"
        >
          <AccordionTrigger className="px-4 py-3 hover:no-underline">
            <div className="flex items-center justify-between w-full pr-4">
              <h2 className="text-lg font-semibold text-card-foreground">{stage.title}</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddConsultant?.(stage.id);
                }}
                className="gap-1 h-9 text-sm"
              >
                <Plus className="h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <div className="space-y-2">
              {stage.consultants.map((consultant, index) => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  onFind={onFind}
                  onAdd={onAdd}
                  onContact={onContact}
                  onProfile={onProfile}
                  onManageTeam={onManageTeam}
                  onPostTask={onPostTask}
                  isManaging={managingConsultantId === consultant.id}
                  shortlistedConsultants={shortlistedByRole[consultant.role] || []}
                  onQuoteStatusChange={onQuoteStatusChange}
                  onMessageClick={onMessageClick}
                  onProfileClick={onProfileClick}
                  onBriefUpdate={onBriefUpdate}
                  onDelete={() => onDeleteConsultant?.(stage.id, consultant.id)}
                  onClone={() => onCloneConsultant?.(stage.id, consultant.id)}
                  onMoveUp={index > 0 ? () => onMoveConsultant?.(stage.id, consultant.id, 'up') : undefined}
                  onMoveDown={index < stage.consultants.length - 1 ? () => onMoveConsultant?.(stage.id, consultant.id, 'down') : undefined}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
