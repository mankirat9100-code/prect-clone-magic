import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, FileText, TrendingUp, Shield, ClipboardList, CheckCircle, Upload, MessageCircle, Download, Mic } from "lucide-react";
import { ProjectSetupDialog } from "@/components/ProjectSetupDialog";

const Landing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[hsl(var(--navy))] border-b border-[hsl(var(--navy-light))]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white"
                >
                  <path d="M3 7v12a2 2 0 002 2h14a2 2 0 002-2V7" />
                  <path d="M3 7l9-4 9 4" />
                  <path d="M9 7v7" />
                  <path d="M15 7v7" />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">AskTrevor</span>
            </div>
            <Button variant="outline" className="bg-white text-foreground hover:bg-white/90" onClick={() => navigate("/auth")}>
              Log in
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[hsl(var(--navy))] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-accent text-sm font-medium mb-4">Your smart planning assistant for any property in Australia</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              What can I build? How much will it cost?<br />
              <span className="text-accent">And how do I do it?</span>
            </h1>
            <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
              AskTrevor brings together everything you need to know about your property — zoning, overlays, 
              setbacks, heights, and local council rules — all in one place. Get instant answers about what you can build, 
              what it will cost, and the exact steps to make it happen.
            </p>

            {/* Search Input */}
            <div className="max-w-4xl mx-auto mb-6">
              <div className="flex gap-3 bg-white rounded-xl p-4 shadow-xl">
                <Input
                  type="text"
                  placeholder="Ask us any question... or enter your property address to get started"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setShowProjectDialog(true)}
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground cursor-pointer text-lg py-3"
                  readOnly
                />
                <Button onClick={() => setShowProjectDialog(true)} className="bg-accent hover:bg-accent/90 px-6 py-3">
                  <Mic className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            <ProjectSetupDialog 
              open={showProjectDialog} 
              onOpenChange={setShowProjectDialog} 
            />
            <p className="text-sm text-gray-400">Searches left: 8 of 8 (resets every 12 hours)</p>
            <p className="text-sm text-gray-400 mt-4">Trusted by homeowners, architects, builders and developers across Australia</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get Planning Answers Instantly
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              No more waiting on hold for the council. No more guessing about planning rules. AskTrevor gives you 
              instant access to everything you need — zoning information, cost estimates, and expert guidance — 
              so you can start building with confidence today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Property Insights Card */}
            <div className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-8 text-center border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-white">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <path d="M8 13h2"/>
                    <path d="M8 17h2"/>
                    <path d="M14 13h2"/>
                    <path d="M14 17h2"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Instant Property & Planning Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant access to zoning information, overlays (bushfire, flood, heritage), building heights, 
                  setbacks, and key planning rules from your local council — all in one clear report.
                </p>
              </div>
            </div>

            {/* Upload Plans Card */}
            <div className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-8 text-center border-2 border-border hover:border-accent/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-9 h-9 text-white absolute">
                    <rect width="16" height="20" x="4" y="2" rx="2"/>
                    <path d="M9 22v-4h6v4"/>
                    <path d="M8 6h.01"/>
                    <path d="M16 6h.01"/>
                    <path d="M12 6h.01"/>
                    <path d="M12 10h.01"/>
                    <path d="M12 14h.01"/>
                    <path d="M16 10h.01"/>
                    <path d="M16 14h.01"/>
                    <path d="M8 10h.01"/>
                    <path d="M8 14h.01"/>
                  </svg>
                  <Upload className="w-5 h-5 text-white/90 absolute -bottom-1 -right-1 bg-accent rounded-full p-1" />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-accent transition-colors">Upload Plans & Get Cost Estimates</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload PDFs of your drawings and AskTrevor will automatically review them, provide planning guidance, 
                  and give you a detailed cost estimate for your project — helping you budget with confidence.
                </p>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-8 text-center border-2 border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 text-white">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M8 10h.01"/>
                    <path d="M12 10h.01"/>
                    <path d="M16 10h.01"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">Ask Questions Anytime</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Trevor is available 24/7 to answer questions about your site, your project, and the rules that apply. 
                  Get clear answers in plain English — no council waiting times, no technical jargon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section className="py-20 bg-gradient-to-br from-muted/40 via-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.1),transparent_70%)]" />
        <div className="relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Who do we help?
            </h2>
            <p className="text-lg text-foreground/80 max-w-3xl mx-auto">
              Whether you're building your dream home, managing a construction project, or advising clients — AskTrevor has the answers you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Homeowners Card */}
            <div className="bg-card rounded-lg p-6 border-2 border-border hover:border-primary hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary group-hover:text-white transition-colors">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Homeowners</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Building a retaining wall? Planning a new house or extension? Get instant answers about what you can build, zoning rules, and planning requirements before you spend a dollar.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => navigate("/auth")}>
                Get Started
              </Button>
            </div>

            {/* Builders Card */}
            <div className="bg-card rounded-lg p-6 border-2 border-border hover:border-primary hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary group-hover:text-white transition-colors">
                  <rect width="18" height="18" x="3" y="3" rx="2"/>
                  <path d="M3 9h18"/>
                  <path d="M9 21V9"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Builders</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Need detailed land information before quoting? Quickly understand site constraints, setbacks, and planning overlays. Make informed decisions and avoid costly surprises mid-project.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => navigate("/auth")}>
                Learn More
              </Button>
            </div>

            {/* Architects Card */}
            <div className="bg-card rounded-lg p-6 border-2 border-border hover:border-primary hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-primary group-hover:text-white transition-colors">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Architects</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Access council documents instantly. Ask planning questions and get immediate, accurate answers. Speed up your design process with real-time compliance checks and site analysis.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => navigate("/auth")}>
                Explore Features
              </Button>
            </div>

            {/* Certifiers/Consultants Card */}
            <div className="bg-card rounded-lg p-6 border-2 border-border hover:border-primary hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                <Shield className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Certifiers & Consultants</h3>
              <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                Verify compliance requirements quickly. Access comprehensive site data, overlays, and planning provisions in seconds. Deliver faster, more accurate assessments for your clients.
              </p>
              <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all" onClick={() => navigate("/auth")}>
                See How
              </Button>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <p className="text-primary text-sm font-medium mb-2">Simple, smart, and built for Australians</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How AskTrevor works</h2>
            <p className="text-lg text-muted-foreground">
              From entering your address to getting your cost estimate — your complete planning assistant in just a few steps.
            </p>
          </div>

          <div className="space-y-20 max-w-6xl mx-auto">
            {/* Step 01 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop" alt="Person typing on keyboard" className="rounded-lg shadow-lg" />
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">01</div>
                <h3 className="text-2xl font-bold mb-4">Enter your property address</h3>
                <p className="text-muted-foreground mb-6">
                  Simply enter your address or upload your plans, and AskTrevor instantly locates your property 
                  and pulls in all the relevant zoning, overlays, and council rules that apply to your site.
                </p>
                <Input placeholder="Enter your property address to get started..." className="mb-4" />
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Automatic location detection and mapping
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Council and planning records pulled instantly
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Complete parcel information at your fingertips
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 02 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">02</div>
                <h3 className="text-2xl font-bold mb-4">Tell us what you're building</h3>
                <p className="text-muted-foreground mb-6">
                  Whether it's a new home, an extension, a deck, or a retaining wall — tell Trevor what you're planning. 
                  This helps focus on the specific rules and requirements that matter for your project.
                </p>
                <Input placeholder="e.g. New home, Extension, Deck, Retaining wall..." className="mb-4" />
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Tailored compliance checks for your specific project
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Relevant regulations highlighted automatically
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Skip irrelevant information and focus on what matters
                  </li>
                </ul>
              </div>
              <div>
                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop" alt="Architectural model" className="rounded-lg shadow-lg" />
              </div>
            </div>

            {/* Step 03 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=600&fit=crop" alt="Planning documents" className="rounded-lg shadow-lg" />
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">03</div>
                <h3 className="text-2xl font-bold mb-4">See your planning & zoning snapshot</h3>
                <p className="text-muted-foreground mb-6">
                  AskTrevor instantly shows you the key planning rules — zoning, overlays, building heights, 
                  setbacks, heritage controls, and flood or bushfire risks. You'll see exactly what regulations 
                  apply to your property in clear, simple language.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm"><strong>Example:</strong> R2 Residential • Min. setback: 6m • Heritage overlay • DA likely required</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Comprehensive zoning and overlay analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Clear breakdown of all applicable regulations
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Instant identification of required approvals
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 04 - Action Plan */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">04</div>
                <h3 className="text-2xl font-bold mb-4">Understand your approval pathway</h3>
                <p className="text-muted-foreground mb-6">
                  Learn whether your project may qualify for CDC (Complying Development) or requires a full 
                  Development Application. AskTrevor breaks down the approval process so you know exactly what to 
                  expect and can plan accordingly.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm"><strong>Next steps:</strong> Your project qualifies for Complying Development (CDC) — faster approval, lower cost.</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Practical, actionable steps tailored to your project
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Clear timelines and cost estimates
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Contact details for key stakeholders
                  </li>
                </ul>
              </div>
              <div>
                <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop" alt="Planning notebook" className="rounded-lg shadow-lg" />
              </div>
            </div>

            {/* Step 05 - Upload */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img src="https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=800&h=600&fit=crop" alt="File upload interface" className="rounded-lg shadow-lg" />
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">05</div>
                <h3 className="text-2xl font-bold mb-4">Upload plans & get detailed costing</h3>
                <p className="text-muted-foreground mb-6">
                  Upload PDFs of your drawings, and AskTrevor automatically reviews them for compliance and provides 
                  a detailed cost estimate for your project. Get planning guidance and accurate budgeting — all from your plans.
                </p>
                <Input placeholder="Upload your plans (PDF) to get cost estimates..." className="mb-4" />
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Drag and drop file uploads
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Automatic cost estimates from your plans
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Planning guidance based on your drawings
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 06 - Chat */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">06</div>
                <h3 className="text-2xl font-bold mb-4">Ask Trevor anything, anytime</h3>
                <p className="text-muted-foreground mb-6">
                  Trevor is available 24/7 to answer questions about your site, your project, and the rules that apply. 
                  Ask in plain English and get clear answers — no waiting on council phone lines, no confusion about regulations.
                </p>
                <Input placeholder="Ask Trevor: 'Will this design need council approval?'" className="mb-4" />
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Get answers in plain English, 24/7
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Full chat history preserved with the property
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    No waiting on council phone lines
                  </li>
                </ul>
              </div>
              <div>
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop" alt="Person on phone call" className="rounded-lg shadow-lg" />
              </div>
            </div>

            {/* Step 07 - Export */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop" alt="Business presentation" className="rounded-lg shadow-lg" />
              </div>
              <div className="order-1 md:order-2">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <div className="text-4xl font-light text-muted-foreground mb-2">07</div>
                <h3 className="text-2xl font-bold mb-4">Move forward with confidence</h3>
                <div className="bg-accent/20 text-accent px-3 py-1 rounded-md text-sm font-medium mb-4 inline-block">
                  Pro Feature
                </div>
                <p className="text-muted-foreground mb-6">
                  Export everything you need to share with your architect, builder, or council. AskTrevor helps you 
                  make smart, compliant decisions from day one — so you can move forward with confidence and avoid costly delays.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <p className="text-sm">Download complete reports & share with your team (Pro)</p>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Export complete reports and chat history
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Share with your architect, builder, or council
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Move forward with confidence and avoid delays
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(var(--navy))] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Features</li>
                <li>Pricing</li>
                <li>Case Studies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Twitter</li>
                <li>LinkedIn</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[hsl(var(--navy-light))] pt-8 text-center text-gray-400">
            <p>&copy; 2024 AskTrevor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;