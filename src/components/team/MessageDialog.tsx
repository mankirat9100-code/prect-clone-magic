import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, Sparkles, Paperclip, X } from 'lucide-react';

interface MessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientName: string;
  recipientEmail?: string;
  role?: string;
  onSend?: (subject: string, message: string) => Promise<void>;
}

export const MessageDialog = ({
  open,
  onOpenChange,
  recipientName,
  recipientEmail = `${recipientName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
  role = 'consultant',
  onSend,
}: MessageDialogProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [senderName, setSenderName] = useState('John Smith');
  const [senderPhone, setSenderPhone] = useState('+61 400 000 000');
  const { toast } = useToast();

  // Pre-populate message when dialog opens
  useEffect(() => {
    if (open && !message) {
      const projectLink = `${window.location.origin}/project/coastal-building-design`;
      const defaultMessage = `Hi ${recipientName},

We're looking for a ${role} to help with our coastal building design project. 

Here's a link to the project in Ask Trevor: ${projectLink}

Please review the project details and let us know if you're interested. We'd be happy to discuss further.

Best regards,
${senderName}
${senderPhone}`;
      
      setMessage(defaultMessage);
      setSubject(`Project Inquiry - ${role.charAt(0).toUpperCase() + role.slice(1)}`);
    }
  }, [open, recipientName, role, senderName, senderPhone]);

  const handleEnhanceWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: 'Enter AI Instructions',
        description: 'Please describe how you want to modify the message.',
        variant: 'destructive',
      });
      return;
    }

    setIsEnhancing(true);
    
    // Simulate AI enhancement
    setTimeout(() => {
      // Simple simulation - in real implementation, this would call an AI service
      let enhancedMessage = message;
      
      if (aiPrompt.toLowerCase().includes('shorter')) {
        enhancedMessage = `Hi ${recipientName},\n\nWe need a ${role} for our coastal building project. Project details: ${window.location.origin}/project/coastal-building-design\n\nInterested? Let's talk.\n\nBest,\n${senderName}\n${senderPhone}`;
      } else if (aiPrompt.toLowerCase().includes('formal')) {
        enhancedMessage = `Dear ${recipientName},\n\nI hope this message finds you well. We are currently seeking a qualified ${role} to assist with our coastal building design project.\n\nI would be grateful if you could review the comprehensive project details available at: ${window.location.origin}/project/coastal-building-design\n\nShould this opportunity align with your expertise, I would welcome the chance to discuss the project further at your earliest convenience.\n\nYours sincerely,\n${senderName}\n${senderPhone}`;
      } else {
        enhancedMessage = message + `\n\n[AI Enhancement: ${aiPrompt}]`;
      }
      
      setMessage(enhancedMessage);
      setAiPrompt('');
      setIsEnhancing(false);
      
      toast({
        title: 'Message Enhanced',
        description: 'AI has updated your message.',
      });
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in both subject and message.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    
    try {
      if (onSend) {
        await onSend(subject, message);
      }
      
      toast({
        title: 'Message Sent',
        description: `Your message has been sent to ${recipientName}.`,
      });
      
      setSubject('');
      setMessage('');
      setAttachments([]);
      setAiPrompt('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to Send',
        description: 'There was an error sending your message.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Message to {recipientName}</DialogTitle>
          <DialogDescription>
            Send an email message to {recipientEmail}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">To</Label>
            <Input
              id="recipient"
              value={recipientEmail}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
              className="resize-none font-mono text-sm"
            />
          </div>

          {/* AI Enhancement Section */}
          <div className="space-y-2 border rounded-lg p-4 bg-muted/50">
            <Label htmlFor="ai-prompt" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Enhance with AI
            </Label>
            <div className="flex gap-2">
              <Textarea
                id="ai-prompt"
                placeholder="e.g., 'Make it more formal' or 'Make it shorter'"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={2}
                className="resize-none"
              />
              <Button
                onClick={handleEnhanceWithAI}
                disabled={isEnhancing || !aiPrompt.trim()}
                className="shrink-0"
                size="sm"
              >
                <Sparkles className="h-4 w-4" />
                {isEnhancing ? 'Enhancing...' : 'Enhance'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Describe how you want to modify the message above
            </p>
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <Label htmlFor="attachments" className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Attachments
            </Label>
            <div className="space-y-2">
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-muted rounded-md text-sm"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* E-Signature Section */}
          <div className="space-y-2 border-t pt-4">
            <Label>E-Signature</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sender-name" className="text-xs">
                  Your Name
                </Label>
                <Input
                  id="sender-name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sender-phone" className="text-xs">
                  Phone Number
                </Label>
                <Input
                  id="sender-phone"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="Your phone"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={isSending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {isSending ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
