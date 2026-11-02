import Link from "next/link";
import { Flame, Play, Sparkles, MessageCircle, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-stadium-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8 animate-fadeIn">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>AI Co-host for Live Cricket Watch-Alongs</span>
        </div>

        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Stands <span className="text-blue-500">.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            The intelligent second-screen companion for live cricket streams. Catches up late joiners in 3 lines, explains controversial moments at your fan level, and reads the room mood in real-time.
          </p>
        </div>

        {/* Live Match Card */}
        <div className="bg-stadium-800/90 border border-stadium-border/80 rounded-2xl p-6 shadow-2xl text-left max-w-lg mx-auto space-y-4 hover:border-blue-500/50 transition-all glow-blue">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              Live Chase • Ball 1 (Over 0.1)
            </span>
            <span className="text-xs text-slate-400 font-mono">T20 World Cup</span>
          </div>

          <div>
            <div className="text-lg font-bold text-white">
              India vs Pakistan (MCG)
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Pakistan: 159/8 (20 ov) • India chasing 160 (Target: 160 off 120 balls)
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
            <div className="bg-stadium-900/60 p-2 rounded-lg border border-stadium-border/40">
              <span className="text-slate-400 block text-[10px]">Target</span>
              <span className="text-white font-semibold font-mono">160 Runs</span>
            </div>
            <div className="bg-stadium-900/60 p-2 rounded-lg border border-stadium-border/40">
              <span className="text-slate-400 block text-[10px]">Required Rate</span>
              <span className="text-amber-400 font-semibold font-mono">8.00 RPO</span>
            </div>
            <div className="bg-stadium-900/60 p-2 rounded-lg border border-stadium-border/40">
              <span className="text-slate-400 block text-[10px]">Opening Bowler</span>
              <span className="text-blue-400 font-semibold">Shaheen Afridi</span>
            </div>
          </div>

          <Link
            href="/watch/mm-vs-cc-final"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            Join Live Room Now
          </Link>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            <span>Top Questions Grouped</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>3-Line Catch-up</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span>Room Mood Meter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Creator Teleprompter</span>
          </div>
        </div>
      </div>
    </main>
  );
}

