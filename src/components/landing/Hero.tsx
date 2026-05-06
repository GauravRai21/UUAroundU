import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CrowdCanvas } from "@/components/ui/crowd";

export function Hero() {
  return (
    <div className='relative min-h-[100dvh] w-full bg-white dark:bg-black text-black dark:text-white overflow-hidden flex flex-col items-center justify-center'>
      <div className='absolute inset-0 w-full h-full pointer-events-none z-0'>
        <CrowdCanvas src='/all-peeps.png' rows={15} cols={7} imageScale={0.7} />
      </div>

      {/* Foreground Content */}
      <div className='relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 px-4 sm:px-6 max-w-4xl mx-auto -translate-y-24 sm:-translate-y-20 md:-translate-y-32'>
        {/* Brand Pill */}
        <div className='flex items-center gap-2 border border-dotted border-black/50 dark:border-white/50 text-black dark:text-white px-3 py-1.5 rounded-[6px] shadow-sm'>
          <TrendingUp className='w-4 h-4 stroke-[3]' />
          <span className='font-bold tracking-tight font-display italic text-xs'>
            CampusHub
          </span>
        </div>

        {/* Headlines */}
        <div className='space-y-4'>
          <h1 className='text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight font-display text-black dark:text-white'>
            Your campus.
            <br />
            All connected.
          </h1>
          <p className='text-base sm:text-lg md:text-xl text-black/80 dark:text-white/80 font-medium max-w-2xl mx-auto leading-relaxed'>
            The all-in-one platform for students to chat, trade, discover
            events, and support their community.
          </p>
        </div>

        {/* Call to Action */}
        <div className='pt-4 sm:pt-6 flex flex-col items-center gap-3 w-full'>
          <Link
            href='/signup'
            className='group flex items-center justify-center gap-2 w-full max-w-[250px] h-12 sm:h-14 rounded-[12px] bg-black dark:bg-white text-white dark:text-black font-bold text-base sm:text-lg hover:-translate-y-[1px] transition-transform shadow-lg'
          >
            Join the Community
            <ArrowRight className='w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform' />
          </Link>
          <p className='text-xs sm:text-sm text-black/60 dark:text-white/60 font-medium mt-2'>
            Already a member?{" "}
            <Link
              href='/login'
              className='text-black dark:text-white hover:underline font-bold underline-offset-4'
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

