import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { X, Send, Bot } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BriefAIAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  briefContent: string;
  onApplyChanges?: (newContent: string) => void;
}

type Message = {
  role: "user" | "assistant";
  content: string;
};

export const BriefAIAssistant = ({
  open,
  onOpenChange,
  briefContent,
  onApplyChanges,
}: BriefAIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // TODO: Implement AI call to help with brief
      // For now, just echo back
      setTimeout(() => {
        const assistantMessage: Message = {
          role: "assistant",
          content: `I can help you improve your brief. Try asking me to:\n\n• Add more detail about specific requirements\n• Format the content better\n• Add bullet points or sections\n• Clarify technical specifications`,
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="animate-in slide-in-from-bottom duration-300 mt-4">
      <Card className="border shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4 bg-primary/5">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Brief Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[400px]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
                <p className="text-sm">
                  Ask me to help improve your project brief
                </p>
                <p className="text-xs mt-2">
                  I can help format, add details, or restructure your content
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me to help with your brief..."
                className="min-h-[60px] resize-none"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
