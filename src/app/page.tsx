import { Suspense } from "react";
import { PersonalCard } from "@/components/personal-card";
import { ContentStream } from "@/components/content-stream";
import { RightPanel } from "@/components/right-panel";
import { ContentStreamSkeleton } from "@/components/skeletons";

export default function Home() {
  return (
    <main className="min-h-screen bg-black selection:bg-purple-500/30 text-zinc-100 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0">
         <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse-slow" />
         <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      {/* Main Grid Layout */}
      <div className="relative z-10 container mx-auto h-screen max-h-screen p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
          
          {/* Left Column: Personal Card */}
          <aside className="hidden md:block md:col-span-3 h-full animate-fade-in-up">
            <div className="h-full glass rounded-2xl border border-white/5 overflow-hidden">
              <PersonalCard />
            </div>
          </aside>

          {/* Middle Column: Dynamic Content Stream */}
          <section className="col-span-1 md:col-span-6 h-full min-h-0 animate-fade-in-up delay-100">
            <div className="h-full glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col">
              <Suspense fallback={<ContentStreamSkeleton />}>
                <ContentStream />
              </Suspense>
            </div>
          </section>

          {/* Right Column: AI Assistant & Navigation */}
          <aside className="hidden md:block md:col-span-3 h-full animate-fade-in-up delay-200">
             <div className="h-full glass rounded-2xl border border-white/5 overflow-hidden">
              <RightPanel />
            </div>
          </aside>

          {/* Mobile Fallback (Hidden on Desktop) */}
          {/* In a real app, we'd have a mobile navigation or stacked layout. 
              For now, the middle column takes full width on mobile. */}
        </div>
      </div>
    </main>
  );
}
