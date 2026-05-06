import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center p-8">
      <main className="flex flex-col items-center gap-12 text-center max-w-2xl">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
          <h1 className="relative text-6xl md:text-7xl font-bold tracking-tight text-foreground">
            Around <span className="text-primary">You</span>
          </h1>
        </div>

        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
          Your campus. All connected. <br />
          <span className="text-base opacity-80 mt-2 block">
            The home for campus chat, marketplace, events, and lost & found.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-4">
          <a
            href="/verify"
            className="h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200"
          >
            Snag my spot
          </a>
          <a
            href="https://nextjs.org/docs"
            className="h-14 px-8 rounded-full border border-border bg-card/50 backdrop-blur-sm text-foreground font-semibold flex items-center justify-center hover:bg-muted/50 transition-colors"
          >
            Read the docs
          </a>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-8">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" />
            Vibe check passed
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span>Built for Gen Z</span>
        </div>
      </main>
    </div>
  );
}
