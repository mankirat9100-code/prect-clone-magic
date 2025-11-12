import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Mic, MicOff, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConsultantBriefEditorProps {
  role: string;
  currentBrief: string;
  onAccept: (newBrief: string) => void;
  onClose: () => void;
}

export const ConsultantBriefEditor = ({
  role,
  currentBrief,
  onAccept,
  onClose,
}: ConsultantBriefEditorProps) => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [brief, setBrief] = useState(currentBrief);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  const handleModify = async () => {
    if (!input.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please describe what you want to change.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('team-brief-generator', {
        body: {
          role,
          currentBrief: brief,
          modification: input,
        },
      });

      if (error) throw error;

      if (data?.brief) {
        setBrief(data.brief);
        setInput('');
        toast({
          title: 'Brief Updated',
          description: 'The consultant brief has been modified.',
        });
      }
    } catch (error) {
      console.error('Error modifying brief:', error);
      toast({
        title: 'Error',
        description: 'Failed to modify brief. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = () => {
    onAccept(brief);
    onClose();
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognitionRef.current.onerror = () => {
      setIsListening(false);
      toast({
        title: 'Error',
        description: 'Failed to capture voice input.',
        variant: 'destructive',
      });
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const handleViewDraft = () => {
    navigate('/draft-brief', {
      state: {
        role,
        brief,
        projectId: '1', // In production, pass actual project ID
      },
    });
  };

  return (
    <Card className="p-4 bg-muted/50 border-primary/20">
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Brief for {role}</h4>
          <div className="p-3 rounded-md bg-card border text-sm whitespace-pre-wrap">
            {brief || 'No brief generated yet.'}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Modify this brief:</label>
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe what you want to change about this brief..."
              className="min-h-[80px] resize-none pr-12"
              disabled={isLoading || isListening}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={`absolute right-2 top-2 ${isListening ? 'text-destructive' : ''}`}
              onClick={handleVoiceInput}
              disabled={isLoading}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          </div>
          {isListening && (
            <p className="text-xs text-muted-foreground">Listening... Click the microphone again to stop.</p>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleModify}
            disabled={isLoading || !input.trim()}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Updating...
              </>
            ) : (
              'Update Brief'
            )}
          </Button>
          <Button
            onClick={handleViewDraft}
            size="sm"
            variant="default"
            className="flex-1 gap-1"
          >
            <FileText className="h-3 w-3" />
            View Draft Brief
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
          >
            Close
          </Button>
        </div>
      </div>
    </Card>
  );
};
