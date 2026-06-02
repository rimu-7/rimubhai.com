"use client";

import { LinkPreview } from "@/components/ui/link-preview";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export default function AboutMe() {
  const pdfUrl = "https://cognizancejournal.com/vol5issue11/V5I1113.pdf";
  const [isPdfHovered, setIsPdfHovered] = useState(false);

  // Advanced Parallax Physics for the PDF Tooltip
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 350, damping: 25, mass: 0.5 };
  const translateX = useSpring(x, springConfig);
  const translateY = useSpring(y, springConfig);

  const handleMouseMove = (event) => {
    const targetRect = event.target.getBoundingClientRect();
    const eventOffsetX = event.clientX - targetRect.left;
    const eventOffsetY = event.clientY - targetRect.top;

    x.set((eventOffsetX - targetRect.width / 2) / 5);
    y.set((eventOffsetY - targetRect.height / 2) / 5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className=""
    >
      <div className="">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          about
        </h2>
      </div>
      {/* Biography Section */}
      <section>
        <div className="text-base leading-relaxed text-foreground/80 text-justify">
          <div>
            I recently received my Master’s degree from{" "}
            <LinkPreview
              url="https://www.cust.edu.cn/"
              img_url="https://res.cloudinary.com/dub1bqk4s/image/upload/v1780325906/c9a20358-2dae-412f-9a43-c75b4bb1bda2.png"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              Changchun University of Science and Technology (CUST)
            </LinkPreview>{" "}
            in 2026, where my research was conducted under the supervision of IEEE Fellow Prof.{" "}
            <LinkPreview
              url="https://zs.cust.edu.cn/szdw/sssds/f2495578b6af46378ac00c1c35a4395f.htm"
              img_url="https://res.cloudinary.com/dub1bqk4s/image/upload/v1780325805/267ecc4a-1f56-4160-b2d9-44f9b115d7d0.png"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              Chunyi Chen
            </LinkPreview>
            . Prior to this, I earned my Bachelor’s degree in Computer Science and Technology from{" "}
            <LinkPreview
              url="https://www.nuist.edu.cn/index.htm"
              img_url="https://res.cloudinary.com/dub1bqk4s/image/upload/v1780331643/5dbf513e-b45f-41e5-86a5-7d37ae48c41c.png"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              Nanjing University of Information Science and Technology
            </LinkPreview>{" "}
            (NUIST) (Binjiang College) in 2024, under the supervision of Prof.{" "}
            <LinkPreview
              url="https://wlwxy.cwxu.edu.cn/info/1227/1855.htm"
              img_url="https://res.cloudinary.com/dub1bqk4s/image/upload/v1780325867/c3fd0d69-4b6d-46c0-be3f-29ba4a9522fe.png"
              className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
            >
              Lou Qianda
            </LinkPreview>
            .
            <br />
            <br />
            My academic work centers on Cybersecurity and Physical Layer Security, specifically
            optimizing secret key generation in FDD systems utilizing Deep Learning architectures.
            During my undergraduate studies, I published my thesis titled{" "}
            <Tooltip.Provider delayDuration={150}>
              <Tooltip.Root open={isPdfHovered} onOpenChange={setIsPdfHovered}>
                <Tooltip.Trigger asChild>
                  <Link
                    href={pdfUrl}
                    target="_blank"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="text-blue-500 font-medium hover:text-blue-700 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-700 transition-all"
                  >
                    &quot;Design and Implementation of a Potato Disease Classification System Based
                    on Deep Learning&quot;
                  </Link>
                </Tooltip.Trigger>

                <AnimatePresence>
                  {isPdfHovered && (
                    <Tooltip.Portal forceMount>
                      <Tooltip.Content
                        side="top"
                        sideOffset={16}
                        className="z-50 [transform-origin:var(--radix-tooltip-content-transform-origin)]"
                        asChild
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            filter: "blur(0px)",
                            transition: { type: "spring", stiffness: 300, damping: 20 },
                          }}
                          exit={{
                            opacity: 0,
                            y: 10,
                            scale: 0.95,
                            filter: "blur(2px)",
                            transition: { duration: 0.15, ease: "easeIn" },
                          }}
                          style={{ x: translateX, y: translateY }}
                          className="relative w-116 h-96 rounded-2xl p-2.5 bg-white/5 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.15)] border border-white/20 dark:bg-black/10 dark:border-white/10"
                        >
                          <div className="relative w-full h-full rounded-xl overflow-hidden bg-white">
                            <iframe
                              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                              className="w-full h-full scale-[1.02]"
                              title="PDF Preview"
                            />
                          </div>
                        </motion.div>
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  )}
                </AnimatePresence>
              </Tooltip.Root>
            </Tooltip.Provider>
            . Parallel to my academic research, I professionally architect secure, privacy-centric
            web applications and explore the synergy between neural networks and secure
            communication protocols.
            <br />
            <br />
            Feel free to drop me an email if you want to collaborate or have a discussion!
            <br />
            <br />
          </div>
        </div>
      </section>

      {/* Research Interests Section */}
      <section>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground/90">
          Research Interests
        </h3>
        <ul className="space-y-4 pl-2 list-none text-foreground/80 text-base">
          {/* Item 1 */}
          <li className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500/80 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-foreground">Physical-layer security</strong>, especially
                secret key generation in FDD systems:{" "}
                <span className="text-muted-foreground font-mono text-sm">
                  [Master&apos;s Thesis &apos;26]
                </span>{" "}
                -{" "}
                <span className="text-muted-foreground font-mono text-sm">
                  under review for publication in adhoc journal(science direct)
                </span>
              </span>
            </div>
          </li>

          {/* Item 2 */}
          <li className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500/80 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-foreground">Deep Learning Architectures</strong> (ResNet,
                1D-CNNs, Applied ML)
              </span>
            </div>
          </li>

          {/* Item 3 (Nested) */}
          <li className="flex flex-col gap-2">
            <div className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500/80 shrink-0" />
              <span className="leading-relaxed">
                <strong className="text-foreground">Secure Protocol & Architecture Design</strong>{" "}
                <span className="text-muted-foreground italic text-sm">(Currently focused on)</span>
              </span>
            </div>
            <ul className="pl-8 space-y-2 list-none">
              <li className="flex items-center gap-3 text-sm text-foreground/70">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                Synergy between Neural Networks and Secure Communications
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/70">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/50 shrink-0" />
                Privacy-Centric Full-Stack Application Architecture
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <br />
      <br />
      <section>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground/90">
          <LinkPreview
            url="https://docs.google.com/document/d/e/2PACX-1vTh-acjHsVksRcFDHuptAOwRmML7Jv7rwVYjnEjTu_fJEU5vFtdgPhfJJF8Noku48MnUlN7PAQ_ubrU/pub"
            className="text-foreground"
            img_url="https://res.cloudinary.com/dub1bqk4s/image/upload/v1780330210/023f2f2c-772a-4965-8986-0495ade41ac5.png"
          >
            Download CV
          </LinkPreview>
        </h3>
      </section>

      {/* Footer Links & Banner */}
    </motion.div>
  );
}
