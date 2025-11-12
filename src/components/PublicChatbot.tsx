import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function PublicChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Hi! I'm Trevor, your AI construction consultant finder. Ask me about your project and I'll help you understand what consultants you might need. Try the demo with 5 free messages!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLimited, setIsLimited] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/trevor-public-demo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: newMessages.filter(m => m.role === "user" || m.role === "assistant"),
          }),
        }
      );

      if (response.status === 429) {
        setIsLimited(true);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "🚫 You've reached the demo limit (5 messages per hour). Sign up now for unlimited access to Trevor AI and connect with real consultants!",
          },
        ]);
        setIsLoading(false);
        return;
      }

      if (!response.ok || !response.body) {
        throw new Error("Failed to get response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      // Add empty assistant message that we'll update
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      setMessageCount((prev) => prev + 1);
      if (messageCount + 1 >= 5) {
        setIsLimited(true);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again or sign up for a more reliable experience!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (messageCount >= 5) {
      setIsLimited(true);
      return;
    }

    const userMessage = input.trim();
    setInput("");
    await streamChat(userMessage);
  };

  return (
    <Card className="relative h-[600px] flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-border shadow-lg">
      {/* Message counter */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Try Trevor AI</span>
        </div>
        <span className="text-sm text-muted-foreground">
          {messageCount}/5 messages
        </span>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input or limit overlay */}
      {isLimited ? (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Demo limit reached! Sign up for unlimited access.
            </p>
            <Button onClick={() => navigate("/auth?mode=signup")} className="w-full">
              Get Started Free
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-muted/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your construction project..."
              disabled={isLoading}
              maxLength={500}
              className="bg-background"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} size="icon">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
