import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage, DirectoryResult } from '@/types/team';
import { Send, User, MessageCircle, Briefcase } from 'lucide-react';

interface AskTrevorSidebarProps {
  onAddConsultant: (result: DirectoryResult) => void;
  onContactConsultant?: (result: DirectoryResult) => void;
  onProfileConsultant?: (result: DirectoryResult) => void;
  searchResults?: DirectoryResult[];
  searchRole?: string;
}

export const AskTrevorSidebar = ({ 
  onAddConsultant, 
  onContactConsultant,
  onProfileConsultant,
  searchResults,
  searchRole 
}: AskTrevorSidebarProps) => {
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm Trevor, your project assistant. I can help you find the right consultants for your building project. What would you like to know?",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    console.log('AskTrevorSidebar useEffect - searchResults:', searchResults, 'searchRole:', searchRole);
    if (searchResults && searchResults.length > 0 && searchRole) {
      console.log('Adding new message to chat with suggestions');
      const newMessage: ChatMessage = {
        id: `suggestions-${searchRole}-${Date.now()}`,
        role: 'assistant',
        content: `Here are recommended ${searchRole}s in your area:`,
        suggestions: searchResults,
        timestamp: new Date(),
      };
      
      // Replace any existing suggestions message for this role
      setMessages(prev => {
        const filteredMessages = prev.filter(msg => 
          !msg.suggestions || !msg.id.startsWith(`suggestions-${searchRole}`)
        );
        return [...filteredMessages, newMessage];
      });
    }
  }, [searchResults, searchRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate Trevor's response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm analyzing your project requirements. Let me help you find the right consultants.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col bg-accent/30">
      <div className="p-6 border-b bg-card">
        <div className="flex items-center gap-2">
          <Switch
            id="auto-update"
            checked={autoUpdate}
            onCheckedChange={setAutoUpdate}
          />
          <Label htmlFor="auto-update" className="text-sm">
            Auto-Update {autoUpdate ? 'ON' : 'OFF'}
          </Label>
        </div>
        {searchRole && (
          <p className="text-sm text-muted-foreground mt-2">
            Showing {searchRole}s in your area
          </p>
        )}
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-card mr-8'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 mr-8 space-y-3">
                  {message.suggestions.map((suggestion) => (
                    <div
                      key={`${message.id}-${suggestion.id}`}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{suggestion.companyName}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {suggestion.specialty}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.rating}⭐ • {suggestion.responseTime} • {suggestion.location}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onProfileConsultant?.(suggestion)}
                              className="gap-1 flex-1"
                            >
                              <User className="h-3 w-3" />
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => onAddConsultant(suggestion)}
                              className="flex-1"
                            >
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onContactConsultant?.(suggestion)}
                              className="gap-1 flex-1"
                            >
                              <MessageCircle className="h-3 w-3" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Trevor anything about your project..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
