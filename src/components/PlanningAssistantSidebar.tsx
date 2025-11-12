import { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface PlanningAssistantSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  rulesContext: string;
}

export const PlanningAssistantSidebar = ({ isOpen, onClose, rulesContext }: PlanningAssistantSidebarProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('planning-assistant', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          rulesContext
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from Planning Agent',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="relative w-full max-w-md bg-card border-l shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Ask Planning Agent</h2>
            <p className="text-xs text-muted-foreground">Ask questions about your compliance rules</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">Welcome to Planning Agent</h3>
              <p className="text-sm text-muted-foreground">
                Ask me anything about the compliance rules, building requirements, or development standards for your project.
              </p>
              <div className="mt-6 space-y-2 text-left w-full">
                <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => setInput('What is the minimum lot size required?')}
                >
                  <span className="text-xs">What is the minimum lot size required?</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => setInput('Can I build under CDC or do I need a DA?')}
                >
                  <span className="text-xs">Can I build under CDC or do I need a DA?</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2 px-3"
                  onClick={() => setInput('What are the setback requirements?')}
                >
                  <span className="text-xs">What are the setback requirements?</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a question about compliance rules..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              className="min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
