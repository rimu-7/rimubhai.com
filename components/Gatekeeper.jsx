"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, RefreshCw, Quote, Tv, Film } from "lucide-react";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1];

const dialogues = [
  {
    quote: "Walter White: Say my name.\nDeclan: Heisenberg.\nWalter White: You're goddamn right.",
    source: "Breaking Bad",
    year: 2012,
    type: "TV Series",
  },
  {
    quote: "Vito Corleone: I'm gonna make him an offer he can't refuse.",
    source: "The Godfather",
    year: 1972,
    type: "Movie",
  },
  {
    quote: "Darth Vader: No, I am your father.\nLuke Skywalker: No... that's not true! That's impossible!",
    source: "Star Wars: Episode V",
    year: 1980,
    type: "Movie",
  },
  {
    quote: "The Joker: Why so serious?",
    source: "The Dark Knight",
    year: 2008,
    type: "Movie",
  },
  {
    quote: "Forrest Gump: My mama always said, 'Life is like a box of chocolates. You never know what you're gonna get.'",
    source: "Forrest Gump",
    year: 1994,
    type: "Movie",
  },
  {
    quote: "Jack Dawson: I'm the king of the world!",
    source: "Titanic",
    year: 1997,
    type: "Movie",
  },
  {
    quote: "Gandalf: You shall not pass!",
    source: "The Lord of the Rings",
    year: 2001,
    type: "Movie",
  },
  {
    quote: "Ned Stark: Winter is coming.",
    source: "Game of Thrones",
    year: 2011,
    type: "TV Series",
  },
  {
    quote: "Morpheus: You take the red pill – you stay in Wonderland, and I show you how deep the rabbit hole goes.",
    source: "The Matrix",
    year: 1999,
    type: "Movie",
  },
  {
    quote: "Spoon boy: Do not try and bend the spoon... There is no spoon.",
    source: "The Matrix",
    year: 1999,
    type: "Movie",
  },
  {
    quote: "Rick Blaine: Here's looking at you, kid.",
    source: "Casablanca",
    year: 1942,
    type: "Movie",
  },
  {
    quote: "The Terminator: I'll be back.",
    source: "The Terminator",
    year: 1984,
    type: "Movie",
  },
  {
    quote: "Andy Dufresne: Get busy living, or get busy dying.",
    source: "The Shawshank Redemption",
    year: 1994,
    type: "Movie",
  },
  {
    quote: "Tony Stark: I love you 3000.",
    source: "Avengers: Endgame",
    year: 2019,
    type: "Movie",
  },
  {
    quote: "Michael Scott: That's what she said.",
    source: "The Office (US)",
    year: 2005,
    type: "TV Series",
  },
  {
    quote: "Tyrion Lannister: That's what I do. I drink and I know things.",
    source: "Game of Thrones",
    year: 2016,
    type: "TV Series",
  },
  {
    quote: "Jesse Pinkman: Yeah, science!",
    source: "Breaking Bad",
    year: 2010,
    type: "TV Series",
  },
  {
    quote: "Travis Bickle: You talkin' to me?",
    source: "Taxi Driver",
    year: 1976,
    type: "Movie",
  },
  {
    quote: "Hannibal Lecter: I ate his liver with some fava beans and a nice Chianti.",
    source: "The Silence of the Lambs",
    year: 1991,
    type: "Movie",
  },
  {
    quote: "Joey Tribbiani: How you doin'?",
    source: "Friends",
    year: 1995,
    type: "TV Series",
  },
  {
    quote: "Daenerys Targaryen: Dracarys.",
    source: "Game of Thrones",
    year: 2013,
    type: "TV Series",
  },
  {
    quote: "The Doctor: I'm the Doctor. Basically, run.",
    source: "Doctor Who",
    year: 2010,
    type: "TV Series",
  },
  {
    quote: "Ron Burgundy: I love lamp.",
    source: "Anchorman",
    year: 2004,
    type: "Movie",
  },
  {
    quote: "Agent Smith: I hate this place. This zoo. This prison. This reality.",
    source: "The Matrix",
    year: 1999,
    type: "Movie",
  },
  {
    quote: "Norman Bates: A boy's best friend is his mother.",
    source: "Psycho",
    year: 1960,
    type: "Movie",
  },
];

function DialogueQuote({ dialogue }) {
  if (!dialogue) return null;

  const lines = dialogue.quote.split("\n");

  return (
    <div className="w-full text-left space-y-2.5">
      <div className="flex items-center gap-1 text-muted-foreground/40 mb-1">
        <Quote className="h-3 w-3 shrink-0" />
        <span className="text-[9px] uppercase tracking-wider font-semibold">dialogue snippet</span>
      </div>

      <div className="space-y-1.5 pl-1.5 border-l-2 border-primary/20">
        {lines.map((line, idx) => {
          const colonIdx = line.indexOf(":");
          if (colonIdx !== -1) {
            const speaker = line.substring(0, colonIdx).trim();
            const speech = line.substring(colonIdx + 1).trim();
            return (
              <div key={idx} className="text-xs sm:text-sm leading-relaxed">
                <span className="font-semibold text-primary/70 uppercase tracking-wide text-[9px] sm:text-[10px] mr-1.5">
                  {speaker}:
                </span>
                <span className="text-muted-foreground italic font-sans">&ldquo;{speech}&rdquo;</span>
              </div>
            );
          }
          return (
            <p key={idx} className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed font-sans">
              &ldquo;{line}&rdquo;
            </p>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
        {dialogue.type === "TV Series" ? (
          <Tv className="h-3 w-3 text-muted-foreground/40 shrink-0" />
        ) : (
          <Film className="h-3 w-3 text-muted-foreground/40 shrink-0" />
        )}
        <span className="text-[10px] font-medium text-muted-foreground/50 tracking-wide">
          {dialogue.source}
        </span>
        <span className="text-[10px] text-muted-foreground/30 font-mono">({dialogue.year})</span>
      </div>
    </div>
  );
}

export default function Gatekeeper({ children, initialVerified = false }) {
  const [mounted, setMounted] = useState(false);
  const [verified, setVerified] = useState(initialVerified);
  const [isExiting, setIsExiting] = useState(false);

  const [dialogue] = useState(() => {
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  });

  useEffect(() => {
    setMounted(true);
    if (initialVerified) return;

    let isVerified = false;
    try {
      isVerified =
        sessionStorage.getItem("turnstile_verified") === "true" ||
        localStorage.getItem("turnstile_verified") === "true";
    } catch (e) {
      console.warn("Storage access is blocked:", e);
    }

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isBot =
      /bot|google|crawler|spider|robot|crawling|lighthouse|pagespeed|headless|archiver|transcoder|pingdom|gtmetrix/i.test(
        userAgent
      ) ||
      (typeof navigator !== "undefined" && !!navigator.webdriver);

    if (isVerified || isBot) {
      setVerified(true);
    }
  }, [initialVerified]);

  const handleVerify = () => {
    try {
      localStorage.setItem("turnstile_verified", "true");
      sessionStorage.setItem("turnstile_verified", "true");
      document.cookie = "turnstile_verified=true; path=/; max-age=31536000; SameSite=Lax";
    } catch (e) {
      console.warn("Storage/cookie access is blocked:", e);
    }
    setIsExiting(true);
    setTimeout(() => {
      setVerified(true);
    }, 600);
  };

  useEffect(() => {
    if (mounted && !verified) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mounted, verified]);

  // During SSR and first client-side mount, render only children
  // to prevent any hydration mismatch.
  if (!mounted) {
    return <>{children}</>;
  }

  // Already verified and dismissed
  if (verified && !isExiting) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <div
        className={
          "fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-500 ease-out " +
          (isExiting ? "opacity-0 pointer-events-none" : "opacity-100")
        }
      >
        <div className="w-full max-w-sm mx-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease }}
            className="flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card shadow-lg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease }}
              className="bg-primary/5 p-3 rounded-full mb-4"
            >
              <ShieldCheck className="h-7 w-7 text-primary" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease }}
              className="text-lg font-bold tracking-tight mb-1"
            >
              security check
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs text-muted-foreground mb-6 max-w-[240px]"
            >
              please verify to proceed to the site
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4, ease }}
              className="w-full flex justify-center mb-6 min-h-[65px]"
            >
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={handleVerify}
                onError={() => {
                  console.warn("Turnstile blocked or failed, failing open...");
                  handleVerify();
                }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="w-full border-t border-border/40 pt-4"
            >
              <DialogueQuote dialogue={dialogue} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
