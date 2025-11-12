import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowLeft, Briefcase, Calendar, Clock, DollarSign, Mic, MicOff, Upload, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SubmitQuote = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [startDate, setStartDate] = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [pricingOption, setPricingOption] = useState("fixed_price");
  const [priceAmount, setPriceAmount] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftQuote, setDraftQuote] = useState("");

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
      setAdditionalNotes(transcript);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setAttachedFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Attached",
      description: `${newFiles.length} file(s) added to your quote`,
    });
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewDraft = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!startDate || !completionTime || !pricingOption) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (pricingOption === "fixed_price" && !priceAmount) {
      toast({
        title: "Missing Price",
        description: "Please enter a price amount for fixed price quote",
        variant: "destructive",
      });
      return;
    }

    // Generate draft quote
    const draft = generateDraftQuote();
    setDraftQuote(draft);
    setShowDraftDialog(true);
  };

  const generateDraftQuote = () => {
    const pricingText = pricingOption === "fixed_price" 
      ? `Fixed Price: $${priceAmount}` 
      : pricingOption === "hourly_rate"
      ? `Hourly Rate: $${priceAmount}/hour`
      : pricingOption === "need_to_discuss"
      ? "Pricing: To be discussed"
      : "Pricing: Subject to site inspection";

    return `QUOTE PROPOSAL

Project: Building Designer Services
Project ID: ${projectId}

TIMELINE
Start Date: ${startDate}
Estimated Completion: ${completionTime}

PRICING
${pricingText}

${additionalNotes ? `ADDITIONAL NOTES\n${additionalNotes}\n\n` : ''}${attachedFiles.length > 0 ? `ATTACHMENTS\n${attachedFiles.map(f => `- ${f.name}`).join('\n')}\n\n` : ''}TERMS & CONDITIONS
- Quote valid for 30 days
- Payment terms to be agreed upon contract signing
- Scope changes may affect timeline and pricing

This quote is provided in good faith and represents our best estimate based on the information available.`;
  };

  const handleSubmit = async () => {
    try {
      // Call the edge function to send the quote email
      const { data, error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          projectId,
          startDate,
          completionTime,
          pricingOption,
          priceAmount,
          additionalNotes,
          attachedFiles: attachedFiles.map(f => f.name),
          draftQuote,
          recipientEmail: "client@example.com", // In real app, get from project data
          senderName: "Your Name", // In real app, get from user profile
          senderEmail: "consultant@example.com", // In real app, get from user profile
        },
      });

      if (error) throw error;

      toast({
        title: "Quote Submitted",
        description: "Your quote has been submitted successfully. The client will receive an email with your proposal.",
      });

      setShowDraftDialog(false);
      // Navigate back to shared project
      navigate(`/shared-project/${projectId}`);
    } catch (error: any) {
      console.error('Error submitting quote:', error);
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/shared-project/${projectId}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>
          <h1 className="text-3xl font-bold mb-2">Submit Your Quote</h1>
          <p className="text-muted-foreground">
            Fill in the details below to submit your quote for this project
          </p>
        </div>

        <form onSubmit={handleReviewDraft}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Quote Details
              </CardTitle>
              <CardDescription>
                Provide your availability and pricing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Estimated Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Estimated Start Date *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              {/* Estimated Time to Complete */}
              <div className="space-y-2">
                <Label htmlFor="completionTime" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Estimated Time to Complete *
                </Label>
                <Input
                  id="completionTime"
                  type="text"
                  placeholder="e.g., 4 weeks, 2 months, 10 business days"
                  value={completionTime}
                  onChange={(e) => setCompletionTime(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Provide your best estimate for project completion
                </p>
              </div>

              {/* Pricing Option */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Pricing Structure *
                </Label>
                <RadioGroup value={pricingOption} onValueChange={setPricingOption}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="fixed_price" id="fixed_price" />
                    <Label htmlFor="fixed_price" className="flex-1 cursor-pointer">
                      <span className="font-medium">Fixed Price</span>
                      <p className="text-sm text-muted-foreground">
                        Provide a total fixed price for the project
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="hourly_rate" id="hourly_rate" />
                    <Label htmlFor="hourly_rate" className="flex-1 cursor-pointer">
                      <span className="font-medium">Hourly Rate</span>
                      <p className="text-sm text-muted-foreground">
                        Charge based on hours worked
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="need_to_discuss" id="need_to_discuss" />
                    <Label htmlFor="need_to_discuss" className="flex-1 cursor-pointer">
                      <span className="font-medium">Need to Discuss Further</span>
                      <p className="text-sm text-muted-foreground">
                        More information needed before providing a quote
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent transition-colors">
                    <RadioGroupItem value="need_inspection" id="need_inspection" />
                    <Label htmlFor="need_inspection" className="flex-1 cursor-pointer">
                      <span className="font-medium">Inspection Required</span>
                      <p className="text-sm text-muted-foreground">
                        Site inspection needed before providing accurate quote
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Price Amount (conditional) */}
              {(pricingOption === "fixed_price" || pricingOption === "hourly_rate") && (
                <div className="space-y-2">
                  <Label htmlFor="priceAmount">
                    {pricingOption === "fixed_price" ? "Total Price (AUD)" : "Hourly Rate (AUD/hour)"}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="priceAmount"
                      type="number"
                      placeholder="0.00"
                      value={priceAmount}
                      onChange={(e) => setPriceAmount(e.target.value)}
                      className="pl-7"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <div className="relative">
                  <Textarea
                    id="additionalNotes"
                    placeholder="Include any additional information, clarifications, or conditions..."
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    rows={4}
                    className="pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`absolute right-2 top-2 ${isListening ? 'text-destructive' : ''}`}
                    onClick={handleVoiceInput}
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

              {/* Attach Documents */}
              <div className="space-y-2">
                <Label>Attach Documents (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PDF, Word, Excel, Images (Max 10MB each)
                  </p>
                </div>
                
                {/* Attached Files List */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-2 mt-3">
                    {attachedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-lg bg-accent/50"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(index)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" size="lg" className="flex-1">
                  Review Draft Quote
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(`/shared-project/${projectId}`)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Draft Quote Dialog */}
        <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Review Draft Quote</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={draftQuote}
                onChange={(e) => setDraftQuote(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDraftDialog(false)}
              >
                Continue Editing
              </Button>
              <Button onClick={handleSubmit}>
                Submit Quote
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SubmitQuote;
