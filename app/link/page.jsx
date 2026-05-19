"use client";

import React from "react";
import { Terminal, Shield, Database, Cpu } from "lucide-react";
import LinkHover from "./LinkHover";
import * as Tooltip from "@radix-ui/react-tooltip";
import Container from "@/components/Container";
import Link from "next/link";

export default function AboutMe() {
  const pdfUrl = "https://cognizancejournal.com/vol5issue11/V5I1113.pdf";

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-4xl font-semibold mb-3 flex items-center gap-2">
        About Me
      </h3>
      <div className="leading-relaxed text-justify text-wrap text-sm">
        <p>
          I am a Master’s researcher at Changchun University of Science and
          Technology{" "}
          <LinkHover link="https://www.cust.edu.cn/">(CUST)</LinkHover>,
          operating under the supervision of IEEE Fellow Prof.{" "}
          <LinkHover link="https://zs.cust.edu.cn/szdw/sssds/f2495578b6af46378ac00c1c35a4395f.htm">
            Chunyi Chen
          </LinkHover>
          . My academic work centers on Cybersecurity and Physical Layer
          Security, specifically optimizing secret key generation in FDD systems
          through Deep Learning architectures such as ResNet and 1D-CNNs. I
          earned my Bachelor’s degree in Computer Science and Technology from
          NUIST (Binjiang College) in 2024, where I was mentored by Prof.{" "}
          <LinkHover link="https://wlwxy.cwxu.edu.cn/info/1227/1855.htm">
            Lou Qianda
          </LinkHover>
          . I published my bachelor thesis{" "}
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Link
                  href={pdfUrl}
                  className="text-blue-500 hover:text-blue-800 underline"
                >
                  Design and Implementation of a Potato Disease Classification
                  System Based on Deep Learning
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="top"
                  className="w-[400px] h-[350px] bg-white shadow-xl rounded-lg overflow-hidden border"
                >
                  <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    className="w-full h-full"
                    title="PDF Preview"
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          . Parallel to my research, My professional focus is on architecting
          secure, privacy-centric applications and exploring the synergy between
          Neural Networks and secure communication protocols. I am actively
          seeking collaborations and technical discussions—please feel free to
          reach out via email.
        </p>
      </div>

      {/* Research Interests Section */}
      <div className=" pt-0 leading-relaxed text-sm">
        <h3 className="text-4xl font-semibold mb-3 flex items-center gap-2">
          Research Interests
        </h3>
        <ul className="space-y-3 pl-8 list-disc">
          <li>Physical Layer Security & FDD Systems.</li>
          <li>Deep Learning Architectures.</li>
          <li>Secure Protocol & Architecture Design.</li>
        </ul>
      </div>
      <h3 className="text-4xl font-semibold mb-3 flex items-center gap-2">
        <LinkHover link="https://docs.google.com/document/d/e/2PACX-1vTh-acjHsVksRcFDHuptAOwRmML7Jv7rwVYjnEjTu_fJEU5vFtdgPhfJJF8Noku48MnUlN7PAQ_ubrU/pub">
          <Link href="/cv">Download CV</Link>
        </LinkHover>
        <LinkHover link="https://threejs.org/manual/#en/installation">
          <Link href="https://threejs.org/manual/#en/installation">
            three.js
          </Link>
        </LinkHover>
        <LinkHover link="https://cognizancejournal.com/vol5issue11/V5I1113.pdf">
          <Link href="https://cognizancejournal.com/vol5issue11/V5I1113.pdf">
            Potato
          </Link>
        </LinkHover>
      </h3>
    </div>
  );
}
