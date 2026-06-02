"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";
import { Film, Quote, RefreshCw, ShieldCheck, Tv } from "lucide-react";
import { useEffect, useState } from "react";

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
    quote:
      "Darth Vader: No, I am your father.\nLuke Skywalker: No... that's not true! That's impossible!",
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
    quote:
      "Forrest Gump: My mama always said, 'Life is like a box of chocolates. You never know what you're gonna get.'",
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
    quote:
      "Morpheus: You take the red pill – you stay in Wonderland, and I show you how deep the rabbit hole goes.",
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

const ease = [0.22, 1, 0.36, 1];

export default function Gatekeeper({ children }) {
  const [status, setStatus] = useState("loading");
  const [dismissed, setDismissed] = useState(false);

  const [dialogue] = useState(() => {
    return dialogues[Math.floor(Math.random() * dialogues.length)];
  });

  useEffect(() => {
    let isVerified = false;
    try {
      isVerified = sessionStorage.getItem("turnstile_verified") === "true";
    } catch (e) {
      console.warn("Storage access is blocked:", e);
    }

    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
    const isBot =
      /bot|google|crawler|spider|robot|crawling|lighthouse|pagespeed|headless|archiver|transcoder|pingdom|gtmetrix/i.test(
        userAgent
      ) ||
      (typeof navigator !== "undefined" && !!navigator.webdriver);

    const timer = setTimeout(() => {
      if (isVerified || isBot) {
        setStatus("success");
      } else {
        setStatus("idle");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status !== "idle") return;

    const fallbackTimer = setTimeout(() => {
      console.warn("Turnstile verification took too long, failing open...");
      setStatus("success");
    }, 3500);

    return () => clearTimeout(fallbackTimer);
  }, [status]);

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => setDismissed(true), 600);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    if (dismissed) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [dismissed]);

  const handleVerify = async (token) => {
    try {
      const res = await fetch("/api/fetch-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        try {
          sessionStorage.setItem("turnstile_verified", "true");
        } catch (e) {
          console.warn("Storage access is blocked:", e);
        }
        setStatus("success");
      } else {
        console.warn("Turnstile server validation failed, failing open...");
        setStatus("success");
      }
    } catch {
      console.warn("Turnstile network error, failing open...");
      setStatus("success");
    }
  };

  if (dismissed) {
    return <>{children}</>;
  }

  const isExiting = status === "success";

  return (
    <>
      {children}
      <div
        className={
          "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ease-out " +
          (isExiting ? "opacity-0 pointer-events-none" : "opacity-100")
        }
      >
        {status === "idle" && (
          <div className="w-full max-w-md mx-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4, ease }}
              >
                <ShieldCheck className="h-10 w-10 text-primary mb-6" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease }}
                className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2"
              >
                welcome
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-sm text-muted-foreground mb-8"
              >
                verifying you&apos;re human
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease }}
                className="mb-8"
              >
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={handleVerify}
                  onError={() => {
                    console.warn("Turnstile blocked or failed, failing open...");
                    try {
                      sessionStorage.setItem("turnstile_verified", "true");
                    } catch (e) {
                      console.warn("Storage access is blocked:", e);
                    }
                    setStatus("success");
                  }}
                />
              </motion.div>

              <AnimatePresence mode="wait">
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-2 text-sm text-destructive mb-6"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    verification failed — please refresh
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="w-full border-t border-border/40 pt-6"
              >
                <div className="flex items-start gap-3 text-left">
                  <Quote className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground/70 leading-relaxed whitespace-pre-line italic">
                      &ldquo;{dialogue.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      {dialogue.type === "TV Series" ? (
                        <Tv className="h-3 w-3 text-muted-foreground/40" />
                      ) : (
                        <Film className="h-3 w-3 text-muted-foreground/40" />
                      )}
                      <span className="text-[11px] font-medium text-muted-foreground/50">
                        {dialogue.source}
                      </span>
                      <span className="text-[11px] text-muted-foreground/30">{dialogue.year}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}
