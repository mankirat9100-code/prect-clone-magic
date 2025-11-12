import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, Loader2, CheckCircle2, Upload, DollarSign, Clock } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();

    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setIsLogin(false);
    }
  }, [navigate, searchParams]);

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const validated = loginSchema.parse({ email, password });
        
        const { error } = await supabase.auth.signInWithPassword({
          email: validated.email,
          password: validated.password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        toast.success("Logged in successfully!");
        navigate("/dashboard");
      } else {
        const validated = signupSchema.parse({
          email,
          password,
          confirmPassword: password,
          fullName: `${firstName} ${lastName}`,
        });

        const redirectUrl = `${window.location.origin}/`;

        const { error } = await supabase.auth.signUp({
          email: validated.email,
          password: validated.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: validated.fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("An account with this email already exists");
          } else {
            toast.error(error.message);
          }
          setIsLoading(false);
          return;
        }

        toast.success("Account created! Please verify your phone number");
        localStorage.setItem('firstLogin', 'true');
        setStep(2);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.issues[0].message);
      } else {
        toast.error("An unexpected error occurred");
      }
      setIsLoading(false);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Phone verification coming soon!");
    navigate("/dashboard");
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description: "Instantly access zoning, overlays, and planning rules"
    },
    {
      icon: Upload,
      title: "Upload Your Plans",
      description: "Get automatic planning guidance from your drawings"
    },
    {
      icon: CheckCircle2,
      title: "Understand Approvals",
      description: "Learn if you qualify for CDC or need a full DA"
    },
    {
      icon: DollarSign,
      title: "Cost Estimates",
      description: "Get detailed project costings from your plans"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Ask Trevor questions about your project anytime"
    }
  ];

  return (
    <div className="min-h-screen flex bg-[#1e293b]">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#1e293b]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#1e293b]" />
              </div>
              <h1 className="text-3xl font-bold text-white">
                Ask <span className="text-primary">Trevor</span>
              </h1>
            </div>
          </div>

          {/* Auth Card */}
          <Card className="bg-[#2d3748] border-gray-700 shadow-2xl">
            <div className="p-8">
              {step === 1 ? (
                <>
                  {/* Mode Heading */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {isLogin ? "Log In" : "Sign Up"}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {isLogin ? "Don't have an account? " : "Already have an account? "}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        {isLogin ? "Sign up" : "Log in"}
                      </button>
                    </p>
                  </div>

                  <form onSubmit={handleStepOne} className="space-y-4">
                    {!isLogin && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-white text-sm font-semibold">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="Joshua"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            disabled={isLoading}
                            className="bg-[#1e293b] border-gray-600 text-white placeholder:text-gray-500 h-12 focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-white text-sm font-semibold">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            type="text"
                            placeholder="Dennis"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            disabled={isLoading}
                            className="bg-[#1e293b] border-gray-600 text-white placeholder:text-gray-500 h-12 focus:border-primary"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white text-sm font-semibold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="josh@asktrevor.ai"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-[#1e293b] border-gray-600 text-white placeholder:text-gray-500 h-12 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white text-sm font-semibold">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="bg-[#1e293b] border-gray-600 text-white placeholder:text-gray-500 h-12 focus:border-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold text-base mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : isLogin ? (
                        "Log In"
                      ) : (
                        <div className="flex flex-col items-center">
                          <span>Start Your Free Trial Now!</span>
                          <span className="text-sm font-normal">No Credit Card Required</span>
                        </div>
                      )}
                    </Button>
                  </form>

                  {!isLogin && (
                    <p className="text-center text-xs text-gray-500 mt-6">
                      By signing up you agree to our{" "}
                      <a href="/terms" className="text-primary hover:text-primary/80">
                        Terms of Use
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <form onSubmit={handlePhoneVerification} className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Secure Your Account</h2>
                    <p className="text-gray-400 text-sm">
                      To access Ask Trevor, you must have a verified Australian mobile number. 
                      This is to ensure you're a real person and also add another layer of security 
                      to your account.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white text-sm font-semibold">
                      Australian mobile (04XX XXX XXX)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0412 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={isLoading}
                      className="bg-[#1e293b] border-gray-600 text-white placeholder:text-gray-500 h-12 focus:border-primary"
                    />
                  </div>

                  <p className="text-center text-sm text-gray-400">
                    We'll send you a 6-digit verification code via SMS
                  </p>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Send Verification Code"
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    By verifying, you agree to our{" "}
                    <a href="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </a>
                  </p>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Right Side - Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e293b] via-[#2d3748] to-[#1e293b] p-12 items-center justify-center">
        <div className="max-w-xl space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Artificial Intelligence for NSW Town Planning
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Ask Trevor is the ultimate tool for saving time by automating planning tasks. 
              The game-changing <span className="text-primary font-semibold">Pathways Module</span> determines 
              in minutes whether a project qualifies for <span className="font-semibold">Exempt, CDC or DA</span> by 
              producing a detailed report which saves hours of manual research.
            </p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-gray-300 text-base leading-relaxed">
            Whether you're a town planner, architect, building designer, certifier or other 
            professional - Ask Trevor enables you to save time, grow your business and achieve 
            a better work-life balance.
          </p>

          {/* Brain Icon */}
          <div className="flex justify-center pt-8">
            <div className="relative">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                <Brain className="w-20 h-20 text-primary" />
              </div>
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
