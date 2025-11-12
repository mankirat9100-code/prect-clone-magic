import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Mic, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MasterBriefInputProps {
  onBriefGenerated: (briefs: Record<string, string>) => void;
}

export const MasterBriefInput = ({ onBriefGenerated }: MasterBriefInputProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Voice input is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: 'Error',
        description: 'Failed to capture voice input.',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: 'Input Required',
        description: 'Please describe your project requirements.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('team-brief-generator', {
        body: { masterBrief: input },
      });

      if (error) throw error;

      if (data?.briefs) {
        onBriefGenerated(data.briefs);
        toast({
          title: 'Briefs Generated',
          description: 'Individual consultant briefs have been created.',
        });
      }
    } catch (error) {
      console.error('Error generating briefs:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate briefs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-primary/5 border-primary/20">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">Project Brief for All Consultants</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Describe your project requirements and AI will create individual briefs for each consultant
            </p>
          </div>
        </div>

        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about your project brief for all the consultants you know of. Include details about what each type of consultant needs to do..."
          className="min-h-[120px] resize-none"
          disabled={isLoading || isListening}
        />

        <div className="flex gap-2">
          <Button
            onClick={handleVoiceInput}
            variant="outline"
            disabled={isLoading || isListening}
            className="gap-2"
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-destructive animate-pulse' : ''}`} />
            {isListening ? 'Listening...' : 'Voice Input'}
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !input.trim()}
            className="gap-2 flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Briefs...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Generate Briefs
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
