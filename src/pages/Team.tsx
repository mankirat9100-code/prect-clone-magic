import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { StageAccordion } from '@/components/team/StageAccordion';
import { AskTrevorSidebar } from '@/components/team/AskTrevorSidebar';
import { DirectorySearchModal } from '@/components/team/DirectorySearchModal';
import { MessageDialog } from '@/components/team/MessageDialog';
import { PostTaskDialog } from '@/components/team/PostTaskDialog';
import { MapSearchView } from '@/components/team/MapSearchView';
import { MasterBriefInput } from '@/components/team/MasterBriefInput';
import { initialTeamData, mockDirectoryResults } from '@/data/teamData';
import { Consultant, DirectoryResult, ProjectStage, ShortlistedConsultant, QuoteStatus } from '@/types/team';
import { RotateCcw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Team = () => {
  const navigate = useNavigate();
  const [stages, setStages] = useState<ProjectStage[]>(initialTeamData);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [sidebarResults, setSidebarResults] = useState<DirectoryResult[]>([]);
  const [sidebarRole, setSidebarRole] = useState<string>('');
  const [managingConsultantId, setManagingConsultantId] = useState<string>('');
  const [shortlistedByRole, setShortlistedByRole] = useState<Record<string, ShortlistedConsultant[]>>({});
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMessageRecipient, setSelectedMessageRecipient] = useState<{ name: string; role: string }>({ name: '', role: '' });
  const [postTaskDialogOpen, setPostTaskDialogOpen] = useState(false);
  const [selectedTaskRole, setSelectedTaskRole] = useState('');
  const [showMapSearch, setShowMapSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();

  const calculateProgress = () => {
    const totalRequired = stages.flatMap(s => s.consultants).filter(c => c.status === 'required' || c.status === 'assigned').length;
    const assigned = stages.flatMap(s => s.consultants).filter(c => c.status === 'assigned').length;
    return totalRequired > 0 ? Math.round((assigned / totalRequired) * 100) : 0;
  };

  const handleFind = (consultant: Consultant) => {
    const results = getDirectoryResults(consultant.role);
    setSidebarResults(results);
    setSidebarRole(consultant.role);
    setSidebarOpen(true); // Open sidebar when Find is clicked
  };

  const handleAdd = (consultant: Consultant) => {
    setStages(prev => 
      prev.map(stage => ({
        ...stage,
        consultants: stage.consultants.map(c =>
          c.id === consultant.id
            ? { ...c, status: 'assigned' as const }
            : c
        ),
      }))
    );

    toast({
      title: 'Consultant Added',
      description: `${consultant.role} has been added to your team.`,
    });
  };

  const handleAddFromDirectory = (result: DirectoryResult) => {
    setStages(prev =>
      prev.map(stage => ({
        ...stage,
        consultants: stage.consultants.map(c =>
          c.role === result.role
            ? {
                ...c,
                status: 'assigned' as const,
                company: result.companyName,
                rating: result.rating,
                specialty: result.specialty,
              }
            : c
        ),
      }))
    );

    setShortlistedByRole(prev => {
      const existing = prev[result.role] || [];
      const alreadyExists = existing.some(s => s.companyName === result.companyName);
      
      if (alreadyExists) return prev;
      
      return {
        ...prev,
        [result.role]: [...existing, {
          companyName: result.companyName,
          role: result.role,
          quoteStatus: 'not-contacted' as QuoteStatus,
          hasUnreadMessages: false
        }]
      };
    });

    toast({
      title: 'Consultant Added',
      description: `✅ Added ${result.companyName} to your team.`,
    });
  };

  const handleQuoteStatusChange = (role: string, company: string, status: QuoteStatus) => {
    setShortlistedByRole(prev => ({
      ...prev,
      [role]: prev[role]?.map(s => 
        s.companyName === company ? { ...s, quoteStatus: status } : s
      ) || []
    }));
    
    toast({
      title: 'Status Updated',
      description: `Updated ${company} status to ${status.replace('-', ' ')}`,
    });
  };

  const handleMessageClick = (company: string, role?: string) => {
    setSelectedMessageRecipient({ name: company, role: role || 'consultant' });
    setMessageDialogOpen(true);
  };

  const handleProfileClick = (consultantId: string) => {
    navigate(`/consultant-profile/${consultantId}`);
  };

  const handleContactConsultant = (result: DirectoryResult) => {
    setSelectedMessageRecipient({ name: result.companyName, role: result.role });
    setMessageDialogOpen(true);
  };

  const handleProfileConsultant = (result: DirectoryResult) => {
    navigate(`/consultant-profile/${result.id}`);
  };

  const handlePostTask = (consultant: Consultant) => {
    setSelectedTaskRole(consultant.role);
    setPostTaskDialogOpen(true);
  };

  const handleManageTeam = (consultant: Consultant) => {
    setManagingConsultantId(prev => prev === consultant.id ? '' : consultant.id);
  };

  const handleReset = () => {
    setStages(initialTeamData);
    toast({
      title: 'Team Reset',
      description: 'Team list has been restored to the original recommendations.',
    });
  };

  const handleSave = () => {
    toast({
      title: 'Team Saved',
      description: 'Your project team has been saved successfully.',
    });
  };

  const getDirectoryResults = (role: string): DirectoryResult[] => {
    return mockDirectoryResults[role as keyof typeof mockDirectoryResults] || [];
  };

  const getAvailableTasks = () => {
    return stages.flatMap(stage => 
      stage.consultants.map(c => ({ role: c.role, id: c.id }))
    );
  };

  const handleBriefsGenerated = (briefs: Record<string, string>) => {
    setStages(prev =>
      prev.map(stage => ({
        ...stage,
        consultants: stage.consultants.map(c => ({
          ...c,
          brief: briefs[c.role] || c.brief,
        })),
      }))
    );
  };

  const handleBriefUpdate = (consultantId: string, brief: string) => {
    setStages(prev =>
      prev.map(stage => ({
        ...stage,
        consultants: stage.consultants.map(c =>
          c.id === consultantId ? { ...c, brief } : c
        ),
      }))
    );
  };

  const handleAddConsultant = (stageId: string) => {
    const newConsultant: Consultant = {
      id: `consultant-${Date.now()}`,
      role: 'New Consultant',
      icon: 'briefcase',
      status: 'required',
      whyNeeded: 'Click to edit role and details',
      whenNeeded: 'TBD',
      notes: 'Add notes about this consultant'
    };

    setStages(prev =>
      prev.map(stage =>
        stage.id === stageId
          ? { ...stage, consultants: [...stage.consultants, newConsultant] }
          : stage
      )
    );
  };

  const handleDeleteConsultant = (stageId: string, consultantId: string) => {
    setStages(prev =>
      prev.map(stage =>
        stage.id === stageId
          ? { ...stage, consultants: stage.consultants.filter(c => c.id !== consultantId) }
          : stage
      )
    );
  };

  const handleCloneConsultant = (stageId: string, consultantId: string) => {
    setStages(prev =>
      prev.map(stage => {
        if (stage.id === stageId) {
          const consultantToClone = stage.consultants.find(c => c.id === consultantId);
          if (consultantToClone) {
            const clonedConsultant: Consultant = {
              ...consultantToClone,
              id: `consultant-${Date.now()}`,
              status: 'required'
            };
            return { ...stage, consultants: [...stage.consultants, clonedConsultant] };
          }
        }
        return stage;
      })
    );
  };

  const handleMoveConsultant = (stageId: string, consultantId: string, direction: 'up' | 'down') => {
    setStages(prev =>
      prev.map(stage => {
        if (stage.id === stageId) {
          const consultants = [...stage.consultants];
          const index = consultants.findIndex(c => c.id === consultantId);
          if (index === -1) return stage;

          const newIndex = direction === 'up' ? index - 1 : index + 1;
          if (newIndex < 0 || newIndex >= consultants.length) return stage;

          [consultants[index], consultants[newIndex]] = [consultants[newIndex], consultants[index]];
          return { ...stage, consultants };
        }
        return stage;
      })
    );
  };

  const progress = calculateProgress();

  if (showMapSearch) {
    return (
      <MapSearchView
        onClose={() => setShowMapSearch(false)}
        onAddConsultant={handleAddFromDirectory}
        onMessageConsultant={handleMessageClick}
        availableTasks={getAvailableTasks()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Project Consultants, Suppliers and Contractors</h1>
              <p className="text-sm text-muted-foreground mt-1">Build your project team and manage all required consultants</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowMapSearch(true)}
                className="gap-2 h-9 text-sm"
              >
                <Search className="h-4 w-4" />
                Find Consultants
              </Button>
              <Button variant="outline" onClick={handleReset} className="gap-2 h-9 text-sm">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-base">Team Setup Progress</span>
              <span className="text-primary font-semibold text-base">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex w-full relative">
        {/* Left Panel - Team List */}
        <div 
          className={`p-6 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'w-full lg:w-[60%]' : 'w-full'
          }`}
          style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
          {/* Master Brief Input */}
          <div className="mb-6">
            <MasterBriefInput onBriefGenerated={handleBriefsGenerated} />
          </div>

          <StageAccordion
            stages={stages} 
            onFind={handleFind} 
            onAdd={handleAdd}
            onContact={(c) => toast({ title: 'Contact', description: `Contacting ${c.company || c.role}...` })}
            onProfile={(c) => toast({ title: 'Profile', description: `Viewing profile for ${c.role}...` })}
            onManageTeam={handleManageTeam}
            onPostTask={handlePostTask}
            managingConsultantId={managingConsultantId}
            shortlistedByRole={shortlistedByRole}
            onQuoteStatusChange={handleQuoteStatusChange}
            onMessageClick={handleMessageClick}
            onProfileClick={handleProfileClick}
            onBriefUpdate={handleBriefUpdate}
            onAddConsultant={handleAddConsultant}
            onDeleteConsultant={handleDeleteConsultant}
            onCloneConsultant={handleCloneConsultant}
            onMoveConsultant={handleMoveConsultant}
          />

          <div className="flex gap-4 mt-6">
            <Button onClick={handleSave} size="lg" className="flex-1 h-10 text-sm">
              Save Team
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg" className="flex-1 h-10 text-sm">
              Reset to Original
            </Button>
          </div>
        </div>

        {/* Right Panel - Ask Trevor Sidebar with Collapsible */}
        <div className={`hidden lg:block transition-all duration-300 ${
          sidebarOpen ? 'lg:w-[40%]' : 'w-0'
        }`}>
          <Collapsible
            open={sidebarOpen}
            onOpenChange={setSidebarOpen}
            className="h-full"
          >
            <CollapsibleContent className="h-screen sticky top-0 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
              <div className="h-full border-l">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧠</span>
                    <h2 className="text-lg font-semibold">Ask Trevor Assistant</h2>
                  </div>
                </div>
                <AskTrevorSidebar 
                  onAddConsultant={handleAddFromDirectory}
                  onContactConsultant={handleContactConsultant}
                  onProfileConsultant={handleProfileConsultant}
                  searchResults={sidebarResults}
                  searchRole={sidebarRole}
                />
              </div>
            </CollapsibleContent>

            {/* Sidebar Toggle Button - Must be inside Collapsible */}
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="fixed right-4 top-24 z-10 rounded-full shadow-lg"
              >
                {sidebarOpen ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </div>

      {/* Directory Search Modal */}
      <DirectorySearchModal
        open={searchModalOpen}
        onOpenChange={setSearchModalOpen}
        role={selectedRole}
        results={getDirectoryResults(selectedRole)}
        onAdd={handleAddFromDirectory}
      />

      {/* Message Dialog */}
      <MessageDialog
        open={messageDialogOpen}
        onOpenChange={setMessageDialogOpen}
        recipientName={selectedMessageRecipient.name}
        role={selectedMessageRecipient.role}
      />

      {/* Post Task Dialog */}
      <PostTaskDialog
        open={postTaskDialogOpen}
        onOpenChange={setPostTaskDialogOpen}
        role={selectedTaskRole}
        projectName="24 Harvest Street, Thrumster"
      />
    </div>
  );
};

export default Team;
