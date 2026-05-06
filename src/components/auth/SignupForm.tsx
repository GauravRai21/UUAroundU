"use client";

import { useState } from "react";
import { Upload, Camera, Check, X, Loader2, User, Mail, Hash, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SignupForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rollNumber: "",
    fullName: "",
  });

  const [idFile, setIdFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const supabase = createClient();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateRollNumber = (roll: string) => {
    return /^UU[0-9]{11}$/.test(roll);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.rollNumber || !formData.fullName) {
        setError("Fill all the boxes fam.");
        return;
      }
      if (!validateRollNumber(formData.rollNumber)) {
        setError("That roll number format is a miss. Needs to be UU + 11 digits.");
        return;
      }
      setStep(2);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFile(file);
      await verifyId(file);
    }
  };

  const verifyId = async (file: File) => {
    setIsVerifying(true);
    setError(null);
    setVerificationResult(null);
    
    try {
      const formDataBody = new FormData();
      formDataBody.append("file", file);
      formDataBody.append("rollNumber", formData.rollNumber);

      const response = await fetch("/api/auth/verify-id", {
        method: "POST",
        body: formDataBody,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.reason || result.error || "ID check failed.");
      }

      setVerificationResult(result);
    } catch (err: any) {
      setError(err.message || "Vibe check failed on the ID. Try a better pic.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSignup = async () => {
    if (!verificationResult?.success) {
      setError("We need to verify that ID first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            roll_number: formData.rollNumber,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Profile creation handled via auth metadata or manual insert
      // For this MVP, we assume a trigger or manual insert in Phase 1
      
      setStep(3); // Success step
    } catch (err: any) {
      setError(err.message || "Signup failed. Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="flex flex-col items-center gap-6 animate-spring">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center border-2 border-success shadow-glow">
          <Check className="w-10 h-10 text-success" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground">You're in.</h2>
          <p className="text-muted-foreground mt-2">Check your email to confirm and join the quad.</p>
        </div>
        <button 
          onClick={() => window.location.href = "/"}
          className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold"
        >
          Back home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 rounded-2xl bg-card border border-border shadow-lg backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground">
          {step === 1 ? "Snag your spot" : "ID Check"}
        </h2>
        <p className="text-muted-foreground mt-1">
          {step === 1 ? "Join the campus hub." : "Let's see that college ID fam."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              name="rollNumber"
              placeholder="Roll Number (e.g. UU...)"
              value={formData.rollNumber}
              onChange={handleInputChange}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all uppercase"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button
            onClick={nextStep}
            className="w-full h-12 mt-4 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div 
            className={`relative group h-48 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 transition-all ${
              verificationResult?.success 
                ? "border-success bg-success/5" 
                : "border-primary/30 hover:border-primary bg-muted/30"
            }`}
          >
            {isVerifying ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground font-medium">Extracting vibes...</span>
              </div>
            ) : verificationResult?.success ? (
              <div className="flex flex-col items-center gap-2 text-success">
                <Check className="w-10 h-10" />
                <span className="text-sm font-bold">Verified.</span>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">Drop your ID here</p>
                  <p className="text-xs text-muted-foreground">JPG or PNG only</p>
                </div>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isVerifying || loading}
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep(1)}
              className="flex-1 h-12 rounded-full border border-border font-bold hover:bg-muted transition-colors"
              disabled={loading}
            >
              Back
            </button>
            <button
              onClick={handleSignup}
              disabled={loading || !verificationResult?.success}
              className="flex-2 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Snagging..." : "Join Now"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
