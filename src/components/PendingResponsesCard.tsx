import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle, Clock, Sparkles, MessageSquare, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface PendingResponse {
  id: string;
  personName: string;
  role: string;
  waitingFor: string;
  urgency: 'urgent' | 'medium' | 'low';
  lastContact: string;
  hasReminder: boolean;
  taskCreated: boolean;
}

const mockPendingResponses: PendingResponse[] = [
  {
    id: '1',
    personName: 'Sarah Mitchell',
    role: 'Structural Engineer',
    waitingFor: 'Response to soil report findings',
    urgency: 'urgent',
    lastContact: '3 days ago',
    hasReminder: true,
    taskCreated: true,
  },
  {
    id: '2',
    personName: 'Michael Chen',
    role: 'Building Designer',
    waitingFor: 'Approval on revised floor plans',
    urgency: 'urgent',
    lastContact: '2 days ago',
    hasReminder: true,
    taskCreated: true,
  },
  {
    id: '3',
    personName: 'David Thompson',
    role: 'Geotechnical Engineer',
    waitingFor: 'Confirmation of site visit date',
    urgency: 'medium',
    lastContact: '1 day ago',
    hasReminder: false,
    taskCreated: true,
  },
  {
    id: '4',
    personName: 'Emma Wilson',
    role: 'Council Planner',
    waitingFor: 'Additional documentation for DA',
    urgency: 'medium',
    lastContact: '4 hours ago',
    hasReminder: false,
    taskCreated: true,
  },
  {
    id: '5',
    personName: 'James Roberts',
    role: 'Hydraulic Consultant',
    waitingFor: 'Review of drainage plans',
    urgency: 'low',
    lastContact: '2 hours ago',
    hasReminder: false,
    taskCreated: false,
  },
];

export const PendingResponsesCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedResponse, setSelectedResponse] = useState<PendingResponse | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateDraftResponse = (response: PendingResponse) => {
    const drafts: Record<string, string> = {
      '1': `Hi Sarah,\n\nThank you for sending through the soil report findings. I've reviewed the documentation and have a few questions regarding the bearing capacity recommendations for the foundation design.\n\nCould we schedule a brief call this week to discuss the geotechnical parameters in more detail? I want to ensure our structural design aligns with your recommendations.\n\nLooking forward to your response.`,
      '2': `Hi Michael,\n\nThank you for your patience. I've reviewed the revised floor plans and they look great overall. The layout changes you've proposed address our earlier concerns about the natural light flow.\n\nI have approval to proceed with these plans. Could you please prepare the final set for council submission?\n\nLet me know if you need anything else from my end.`,
      '3': `Hi David,\n\nThanks for reaching out. I'd like to confirm the site visit for Thursday, 15th at 10:00 AM. Please let me know if this works for you.\n\nI'll ensure the site is accessible and all relevant documentation is available for your review.\n\nLooking forward to seeing you then.`,
      '4': `Hi Emma,\n\nThank you for your patience. I've compiled the additional documentation you requested for the DA. Please find attached:\n\n- Updated shadow diagrams\n- Revised landscape plans\n- Additional heritage impact assessment\n\nPlease let me know if you need any other information to progress the application.`,
      '5': `Hi James,\n\nThank you for sending through the drainage plans. I've had a chance to review them and they look comprehensive.\n\nI have a few minor clarifications I'd like to discuss regarding the stormwater detention system. Would you be available for a quick call tomorrow afternoon?\n\nAppreciate your work on this.`,
    };
    return drafts[response.id] || 'Hi,\n\nThank you for your message.\n\n';
  };

  const handleResponseClick = (response: PendingResponse) => {
    setSelectedResponse(response);
    setIsGenerating(true);
    setDialogOpen(true);
    
    // Simulate AI generating response
    setTimeout(() => {
      setReplyMessage(generateDraftResponse(response));
      setIsGenerating(false);
    }, 800);
    setAiInput('');
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    
    toast({
      title: 'Response Sent',
      description: `Your message has been sent to ${selectedResponse?.personName}`,
    });
    
    setDialogOpen(false);
    setReplyMessage('');
    setSelectedResponse(null);
    setAiInput('');
  };

  const handleAiRefine = () => {
    if (!aiInput.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI refining the message
    setTimeout(() => {
      toast({
        title: 'Message Updated',
        description: 'Your draft has been refined based on your instructions',
      });
      setIsGenerating(false);
      setAiInput('');
    }, 1000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const urgentCount = mockPendingResponses.filter(r => r.urgency === 'urgent').length;
  const mediumCount = mockPendingResponses.filter(r => r.urgency === 'medium').length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Important Messages & Pending Responses
            <Badge variant="outline" className="ml-auto text-xs">
              AI Analyzed
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {urgentCount} urgent • {mediumCount} medium priority responses needed
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPendingResponses.map((response) => (
              <div
                key={response.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                  response.urgency === 'urgent'
                    ? 'bg-destructive/5 border-destructive/30'
                    : response.urgency === 'medium'
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-muted/30'
                }`}
                onClick={() => handleResponseClick(response)}
              >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-base font-medium">{response.personName}</p>
                    <span className="text-sm text-muted-foreground">• {response.role}</span>
                    {response.hasReminder && (
                      <AlertCircle className="h-3.5 w-3.5 text-destructive ml-auto flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className="text-base text-muted-foreground mb-2">
                    Waiting for: <span className="text-foreground">{response.waitingFor}</span>
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      variant={getUrgencyColor(response.urgency)}
                      className="text-xs capitalize"
                    >
                      {response.urgency}
                    </Badge>
                    
                    {response.taskCreated && (
                      <Badge variant="outline" className="text-xs">
                        Task Created
                      </Badge>
                    )}
                    
                    <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                      <Clock className="h-3 w-3" />
                      {response.lastContact}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/messages');
            }}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            View All Messages
          </Button>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <div className="space-y-1">
              <DialogTitle className="text-2xl">To: {selectedResponse?.personName}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {selectedResponse?.role} • Re: {selectedResponse?.waitingFor}
              </p>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-6 py-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="reply-message" className="text-base font-semibold">Draft Response</Label>
                {isGenerating && (
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                    AI Drafting...
                  </Badge>
                )}
              </div>
              <Textarea
                id="reply-message"
                placeholder="AI is generating a draft response..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="min-h-[300px] font-sans text-base leading-relaxed"
                disabled={isGenerating}
              />
              
              {replyMessage && !isGenerating && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground">
                    Best regards,<br />
                    Joshua Dennis<br />
                    Dennis Partners<br />
                    <span className="text-xs">joshua@dennispartners.com.au</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <Label htmlFor="ai-input" className="text-base font-semibold">Refine with AI</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Tell the AI how you'd like to adjust the response
              </p>
              <div className="flex gap-2">
                <Textarea
                  id="ai-input"
                  placeholder="e.g., Make it more formal, add urgency, mention the deadline..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="min-h-[80px] flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAiRefine();
                    }
                  }}
                />
              </div>
              <Button 
                onClick={handleAiRefine} 
                disabled={!aiInput.trim() || isGenerating}
                size="sm"
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Refine Draft
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <div className="flex-1 flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-3.5 w-3.5" />
              This will be added to your message chain with {selectedResponse?.personName}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendReply} disabled={!replyMessage.trim() || isGenerating}>
                <Send className="h-4 w-4 mr-2" />
                Send Response
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
