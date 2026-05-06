import { Hero } from "@/components/landing/Hero";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <main className="relative">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      <Hero />
    </main>
  );
}
