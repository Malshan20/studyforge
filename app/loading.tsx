"use client"

import { useEffect, useState } from "react"
import { Flame, Loader2 } from "lucide-react"

export default function Loading() {
  const [messageIndex, setMessageIndex] = useState(0)

  const messages = [
    "Forging your study tools...",
    "Heating up the forge...",
    "Sharpening your notes...",
    "Almost ready to spark your learning...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
      {/* Animated floating embers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[6px] h-[6px] rounded-full bg-primary/20 animate-ember"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 80 + 18}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`,
              opacity: Math.random() * 0.65 + 0.3,
              boxShadow: "0 0 18px 2px #ea580c22",
              filter: "blur(0.5px)",
            }}
          />
        ))}
      </div>

      {/* Main Forge Loader */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Forge/Flame animated icon */}
        <div className="relative flex items-center justify-center w-28 h-28">
          {/* Glow and blurring "fire" */}
          <div className="absolute inset-0 blur-2xl bg-orange-500/20 animate-pulse rounded-full" />
          <div className="absolute inset-0 blur-3xl bg-orange-400/20 animate-pulse rounded-full" style={{ animationDelay: '0.6s' }} />

          {/* Actual Forge Flame */}
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 animate-bounce-slow">
            <Flame className="w-16 h-16 text-primary animate-flame-lick" />
            {/* Flicker highlight */}
            <div className="absolute w-8 h-8 top-3 right-4 bg-white/10 rounded-full blur-md animate-flicker" />
          </div>
          {/* Rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 border-2 border-dashed border-primary/40 rounded-full animate-spin-slower" />
          </div>
        </div>

        {/* Branding for Study Forge */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-orange-500/80 to-primary bg-clip-text text-transparent animate-gradient uppercase tracking-wide drop-shadow-sm">
            Study Forge
          </h1>
          <p className="text-orange-600 text-xs md:text-sm tracking-widest font-semibold uppercase opacity-80 animate-fade-in">Igniting Knowledge</p>
          {/* Flame loading bar */}
          <div className="w-48 h-2 bg-background/80 border border-primary/10 rounded-full overflow-hidden mt-2 shadow-inner">
            <div className="h-full bg-gradient-to-r from-orange-400 via-primary to-orange-400 animate-forge-bar" />
          </div>
        </div>

        {/* Rotating forging messages */}
        <div className="flex flex-col items-center">
          <Loader2 className="h-6 w-6 text-primary animate-spin mb-2" />
          <p className="text-sm text-muted-foreground animate-fade-in text-center max-w-sm min-h-[28px]" key={messageIndex}>
            {messages[messageIndex]}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes ember {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          70% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-70vh) scale(1.2);
            opacity: 0;
          }
        }
        .animate-ember {
          animation: ember linear infinite;
        }
        @keyframes flame-lick {
          0%,100% { filter: brightness(1.07) drop-shadow(0 0 12px #f59e42bb);}
          20% { filter: brightness(1.13) drop-shadow(0 0 16px #fdba74cc);}
          30% { filter: brightness(0.97) drop-shadow(0 0 8px #fb923c66);}
          60% { filter: brightness(1.09) drop-shadow(0 0 20px #fbbf24bb);}
          80% { filter: brightness(0.98) drop-shadow(0 0 10px #ffedd5bb);}
        }
        .animate-flame-lick {
          animation: flame-lick 2.2s infinite both;
        }
        @keyframes flicker {
          0%,19%,21%,23%,25%,54%,56%,100% {
            opacity: 0.9;
          }
          20%,22%,24%,55% {
            opacity: 0.3;
          }
        }
        .animate-flicker {
          animation: flicker 2.7s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-9px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.4s ease-in-out infinite;
        }
        @keyframes spin-slower {
          100% { transform: rotate(360deg);}
        }
        .animate-spin-slower {
          animation: spin-slower 12s linear infinite;
        }
        @keyframes forge-bar {
          0% {transform: translateX(-100%);}
          100% {transform: translateX(100%);}
        }
        .animate-forge-bar {
          animation: forge-bar 1.6s cubic-bezier(.4,1.6,.5,1) infinite;
        }
        @keyframes gradient {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3.5s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity:0; transform:translateY(10px);}
          to { opacity:1; transform:translateY(0);}
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out;}
      `}</style>
    </div>
  )
}
