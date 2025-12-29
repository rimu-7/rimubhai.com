'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-neutral-950 flex flex-col items-center justify-center relative overflow-hidden text-neutral-200 antialiased selection:bg-cyan-500/30">
      
      {/* Background Gradients (Aceternity Style) */}
      <div className="absolute inset-0 w-full h-full bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
      <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-20" />
      
      {/* Floating Elements Animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-4"
      >
        {/* The 404 Glitch Text */}
        <div className="relative">
          <motion.h1 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[150px] md:text-[200px] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-200 to-neutral-800"
          >
            404
          </motion.h1>
          
          {/* Glowing orb behind text */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-cyan-500 rounded-full blur-[100px] -z-10"
          />
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-100">
          Page Not Found
        </h2>
        <p className="text-neutral-400 max-w-md mb-8 text-sm md:text-base">
          It seems you've ventured into a void where this page doesn't exist. 
          The coordinates are invalid.
        </p>

        {/* Shadcn-style Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <button className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md bg-neutral-50 px-8 font-medium text-neutral-950 transition-all duration-300 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              <Home className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              <span>Go Home</span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
            </button>
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="group inline-flex h-10 items-center justify-center rounded-md border border-neutral-800 bg-neutral-950 px-8 font-medium text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
          >
            <MoveLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Go Back
          </button>
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="absolute bottom-10 text-xs text-neutral-600 font-mono">
        ERROR_CODE_404 // SYSTEM_HALTED
      </div>
    </div>
  );
}