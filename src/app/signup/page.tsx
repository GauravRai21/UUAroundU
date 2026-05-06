import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
      <SignupForm />
      
      <p className="mt-8 text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary font-semibold hover:underline">
          Log in fam
        </a>
      </p>
    </div>
  );
}
