import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Star,
  Send,
  Paperclip,
  MoreVertical,
  Mail,
  MessageSquare,
  FileText,
  Download,
  Sparkles,
  RefreshCw,
  X,
} from "lucide-react";
import { mockMessageThreads } from "@/data/messageData";
import { MessageThread, MessageFilter } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Messages = () => {
  const { toast } = useToast();
  const location = useLocation();
  const composeAreaRef = useRef<HTMLDivElement>(null);
  const [threads, setThreads] = useState<MessageThread[]>(mockMessageThreads);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"app" | "email">("email");
  const [showAiAssist, setShowAiAssist] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  // Handle pre-composed email from task responses
  useEffect(() => {
    const state = location.state as any;
    if (state?.composeTo && state?.emailType) {
      // Use setTimeout to ensure state updates are processed
      setTimeout(() => {
        handleComposeEmail(state.composeTo, state.emailType, state.taskTitle, state.company);
      }, 100);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleComposeEmail = async (
    consultantName: string,
    emailType: "accept" | "decline" | "message" | "meeting",
    taskTitle: string,
    company: string,
  ) => {
    setIsGeneratingEmail(true);

    // Find or create thread for this consultant
    let thread = threads.find((t) => t.consultantName === consultantName);

    if (!thread) {
      // Create new thread
      const newThread: MessageThread = {
        id: `thread-${Date.now()}`,
        consultantName,
        consultantCompany: company,
        avatar: "/placeholder.svg",
        role: taskTitle,
        task: taskTitle,
        projectName: "001 Dennis House",
        lastMessage: "",
        lastMessageTime: new Date(),
        unreadCount: 0,
        isFavorite: false,
        messages: [],
      };

      // Add to threads and use the new thread
      setThreads((prev) => [newThread, ...prev]);
      thread = newThread;
    }

    // Select the thread immediately
    setSelectedThread(thread);
    const existingContext = thread.messages.length > 0 ? "Has existing conversation" : undefined;

    try {
      const { data, error } = await supabase.functions.invoke("generate-email", {
        body: {
          type: emailType,
          consultantName,
          company,
          taskTitle,
          existingContext,
        },
      });

      if (error) throw error;

      if (data?.emailContent) {
        setMessageText(data.emailContent);
        setDeliveryMethod("email");

        // Scroll to compose area after a short delay to ensure state is updated
        setTimeout(() => {
          composeAreaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 200);

        toast({
          title: "Email Ready",
          description: "AI has composed your email. Review and send when ready.",
        });
      }
    } catch (error: any) {
      console.error("Error generating email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  const handleRegenerateEmail = async () => {
    if (!selectedThread) return;

    setIsGeneratingEmail(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-email", {
        body: {
          type: "message",
          consultantName: selectedThread.consultantName,
          company: selectedThread.consultantCompany,
          taskTitle: selectedThread.task,
          existingContext: selectedThread.messages.length > 0 ? "Has existing conversation" : undefined,
        },
      });

      if (error) throw error;

      if (data?.emailContent) {
        setMessageText(data.emailContent);
        toast({
          title: "Email Regenerated",
          description: "AI has created a new version of your email.",
        });
      }
    } catch (error: any) {
      console.error("Error regenerating email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to regenerate email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  // Get unique project names for filter
  const uniqueProjects = ["all", ...Array.from(new Set(threads.map((t) => t.projectName)))];

  const filteredThreads = threads
    .filter((thread) => {
      if (filter === "unread") return thread.unreadCount > 0;
      if (filter === "favorites") return thread.isFavorite;
      return true;
    })
    .filter((thread) => {
      if (projectFilter !== "all") return thread.projectName === projectFilter;
      return true;
    })
    .filter(
      (thread) =>
        thread.consultantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.consultantCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.projectName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      // Sort unread first, then by time
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return b.lastMessageTime.getTime() - a.lastMessageTime.getTime();
    });

  const unreadCount = threads.reduce((sum, thread) => sum + thread.unreadCount, 0);

  const handleThreadClick = (thread: MessageThread) => {
    setSelectedThread(thread);
    // Mark messages as read
    setThreads((prev) =>
      prev.map((t) =>
        t.id === thread.id
          ? {
              ...t,
              unreadCount: 0,
              messages: t.messages.map((m) => ({ ...m, isRead: true })),
            }
          : t,
      ),
    );
  };

  const toggleFavorite = (threadId: string) => {
    setThreads((prev) => prev.map((t) => (t.id === threadId ? { ...t, isFavorite: !t.isFavorite } : t)));
  };

  const handleGenerateAiResponse = () => {
    if (!selectedThread) return;

    setIsGeneratingAi(true);

    // Simulate AI generating a response based on conversation context
    setTimeout(() => {
      const lastMessage = selectedThread.messages[selectedThread.messages.length - 1];
      let suggestion = "";

      if (aiPrompt.trim()) {
        suggestion = `Thank you for your message. ${aiPrompt} I'll review the details and get back to you shortly with the information you need.`;
      } else if (
        lastMessage &&
        (lastMessage.text.toLowerCase().includes("quote") || lastMessage.text.toLowerCase().includes("price"))
      ) {
        suggestion = `Thank you for your interest in the ${selectedThread.task} for 24 Harvest Street, Thrumster. I'd be happy to provide a detailed quote. Based on your project requirements, I can prepare a comprehensive proposal by the end of this week. Would you like me to include material options and timeline estimates?`;
      } else if (
        lastMessage &&
        (lastMessage.text.toLowerCase().includes("timeline") || lastMessage.text.toLowerCase().includes("schedule"))
      ) {
        suggestion = `Thank you for reaching out about the timeline. For the ${selectedThread.task}, we typically need 2-3 weeks for initial planning and approvals. I can provide a detailed project schedule once we confirm the scope. Would you like to set up a call to discuss this further?`;
      } else if (lastMessage?.attachments && lastMessage.attachments.length > 0) {
        suggestion = `Thank you for sharing those documents. I've reviewed the ${lastMessage.attachments[0].name} and it looks great. I have a few questions about the specifications. Can we schedule a quick call to discuss the details?`;
      } else {
        suggestion = `Thank you for your message regarding the ${selectedThread.task}. I appreciate you providing those details. I'll review everything carefully and respond with next steps within 24 hours. Please let me know if you need anything else in the meantime.`;
      }

      setAiSuggestion(suggestion);
      setMessageText(suggestion);
      setIsGeneratingAi(false);
    }, 1500);
  };

  const handleRefineAi = () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Refinement prompt needed",
        description: "Please enter instructions for how to refine the response.",
        variant: "destructive",
      });
      return;
    }
    handleGenerateAiResponse();
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedThread) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      text: messageText,
      sender: "user" as const,
      timestamp: new Date(),
      isRead: true,
      deliveryMethod: deliveryMethod,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === selectedThread.id
          ? {
              ...t,
              messages: [...t.messages, newMessage],
              lastMessage: messageText,
              lastMessageTime: new Date(),
            }
          : t,
      ),
    );

    setSelectedThread((prev) =>
      prev
        ? {
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: messageText,
            lastMessageTime: new Date(),
          }
        : null,
    );

    setMessageText("");
    setAiSuggestion("");
    setAiPrompt("");
    setShowAiAssist(false);

    toast({
      title: "Message sent",
      description: `Your message to ${selectedThread.consultantName} has been sent via ${deliveryMethod === "email" ? "email" : "in-app chat"}.`,
    });
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left Sidebar - Message Threads */}
      <div className="w-full lg:w-96 border-r bg-card flex flex-col overflow-hidden">
        {/* Search and Filters */}
        <div className="p-4 space-y-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Project Filter */}
          <div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {uniqueProjects
                  .filter((p) => p !== "all")
                  .map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className="flex-1"
            >
              All
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
              className="flex-1"
            >
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={filter === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorites")}
              className="flex-1"
            >
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thread List */}
        <ScrollArea className="flex-1">
          {filteredThreads.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>No messages found</p>
            </div>
          ) : (
            filteredThreads.map((thread) => (
                <div
                key={thread.id}
                onClick={() => handleThreadClick(thread)}
                className={`p-3 sm:p-4 cursor-pointer hover:bg-accent transition-colors border-b overflow-hidden ${
                  selectedThread?.id === thread.id ? "bg-accent" : ""
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                      <AvatarImage src={thread.avatar} />
                      <AvatarFallback>
                        {thread.consultantName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {thread.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {thread.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm sm:text-base font-semibold truncate ${thread.unreadCount > 0 ? "text-foreground" : "text-foreground"}`}
                        >
                          {thread.consultantCompany}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">{thread.role}</p>
                        <p className="text-xs font-medium text-primary mt-0.5 truncate">Project: {thread.projectName}</p>
                      </div>
                      <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatTime(thread.lastMessageTime)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(thread.id);
                          }}
                        >
                          <Star className={`h-3 w-3 ${thread.isFavorite ? "fill-yellow-400 text-yellow-400" : ""}`} />
                        </Button>
                      </div>
                    </div>
                    <p
                      className={`text-xs sm:text-sm line-clamp-2 ${thread.unreadCount > 0 ? "font-medium" : "text-muted-foreground"}`}
                    >
                      {thread.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      {/* Right Panel - Conversation */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {selectedThread ? (
          <>
            {/* Conversation Header */}
            <div className="sticky top-0 z-header p-3 sm:p-4 border-b bg-card flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={selectedThread.avatar} />
                  <AvatarFallback>
                    {selectedThread.consultantName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm sm:text-base font-semibold truncate">{selectedThread.consultantName}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {selectedThread.role} • {selectedThread.consultantCompany}
                  </p>
                  <p className="text-xs font-medium text-primary mt-0.5 truncate hidden sm:block">Project: {selectedThread.projectName}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>View Task Details</DropdownMenuItem>
                  <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Task Context Badge */}
            <div className="px-3 sm:px-4 py-2 bg-accent/50 border-b">
              <Badge variant="secondary" className="text-xs truncate max-w-full">
                Task: {selectedThread.task}
              </Badge>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-3 sm:p-4 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto w-full">
                {selectedThread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] break-words rounded-lg px-3 sm:px-4 py-2 sm:py-3 ${
                        message.deliveryMethod === "email"
                          ? message.sender === "user"
                            ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700 text-foreground"
                            : "bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 text-foreground"
                          : message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                      }`}
                    >
                      {/* Delivery Method Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        {message.deliveryMethod === "email" ? (
                          <Badge variant="outline" className="text-xs gap-1 bg-background/50">
                            <Mail className="h-3 w-3" />
                            Email
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs gap-1 bg-background/50">
                            <MessageSquare className="h-3 w-3" />
                            In-App
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm">{message.text}</p>

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 p-2 rounded bg-background/50 border border-border"
                            >
                              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{attachment.name}</p>
                                <p className="text-xs text-muted-foreground">{attachment.size}</p>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <p
                        className={`text-xs mt-2 ${
                          message.deliveryMethod === "email"
                            ? "text-muted-foreground"
                            : message.sender === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div ref={composeAreaRef} className="border-t bg-card">
              <div className="p-6 max-w-4xl mx-auto space-y-4">
                {/* AI Assistant Section */}
                {showAiAssist && (
                  <div className="p-4 border rounded-lg bg-accent/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">AI Reply Assistant</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowAiAssist(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {aiSuggestion ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">AI suggested response:</p>
                        <div className="p-3 bg-background rounded border text-sm">{aiSuggestion}</div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMessageText(aiSuggestion)}
                          className="w-full"
                        >
                          Use This Response
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleGenerateAiResponse} disabled={isGeneratingAi} className="w-full" size="sm">
                        {isGeneratingAi ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate AI Response
                          </>
                        )}
                      </Button>
                    )}

                    {/* Refinement Section */}
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-xs">Refine the response:</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="e.g., Make it more formal, add pricing details..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="text-sm"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={handleRefineAi}
                          disabled={!aiPrompt.trim() || isGeneratingAi}
                        >
                          Refine
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Method Selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Send as:</span>
                    <div className="flex gap-1 border rounded-lg p-1">
                      <Button
                        variant={deliveryMethod === "app" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDeliveryMethod("app")}
                        className="gap-2"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Chat
                      </Button>
                      <Button
                        variant={deliveryMethod === "email" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setDeliveryMethod("email")}
                        className="gap-2"
                      >
                        <Mail className="h-3 w-3" />
                        Email
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attach
                    </Button>
                    {!showAiAssist && (
                      <Button variant="outline" size="sm" onClick={() => setShowAiAssist(true)}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Assist
                      </Button>
                    )}
                    {messageText.trim() && deliveryMethod === "email" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRegenerateEmail}
                        disabled={isGeneratingEmail}
                        className="gap-2"
                      >
                        {isGeneratingEmail ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            Update Email
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Compose Area - Much Larger */}
                <div className="space-y-3">
                  <Textarea
                    placeholder={deliveryMethod === "email" ? "Compose your email message..." : "Type your message..."}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="min-h-[280px] text-base resize-y"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {deliveryMethod === "email"
                        ? "Press Ctrl+Enter to send email"
                        : "Press Ctrl+Enter to send message"}
                    </span>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || isGeneratingEmail}
                      size="lg"
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {deliveryMethod === "email" ? "Send Email" : "Send Message"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-1rem font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a message thread from the list to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
