import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-4xl text-primary">Supabase Connection</h1>
      
      <div className="p-6 rounded-xl bg-card border border-border shadow-md max-w-md w-full">
        {error ? (
          <div className="text-destructive">
            <p className="font-semibold">Connection Error:</p>
            <p className="text-sm opacity-80">{error.message}</p>
          </div>
        ) : (
          <div className="text-success">
            <p className="font-semibold text-xl">Connected Successfully! ✅</p>
            <p className="text-muted-foreground text-sm mt-2">
              {user ? `Logged in as: ${user.email}` : "Ready for authentication."}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">P</div>
        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">A</div>
        <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center text-success-foreground font-bold">S</div>
      </div>

      <p className="text-muted-foreground italic">"Yo, who's at the quad?"</p>
    </div>
  );
}
