import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export const VoiceInput = ({ onTranscript }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: 'Error',
        description: 'Could not access microphone',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: { audio: base64Audio },
        });

        if (error) throw error;

        if (data?.text) {
          onTranscript(data.text);
          toast({
            title: 'Success',
            description: 'Audio transcribed successfully',
          });
        }
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      toast({
        title: 'Error',
        description: 'Could not transcribe audio',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className="bg-background"
    >
      {isRecording ? (
        <>
          <Square className="h-4 w-4 mr-2 fill-current" />
          Stop
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Voice'}
        </>
      )}
    </Button>
  );
};
