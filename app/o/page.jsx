"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import Container from "@/components/Container";

const cvConfig = {
  en: {
    view: "https://docs.google.com/document/d/e/2PACX-1vTh-acjHsVksRcFDHuptAOwRmML7Jv7rwVYjnEjTu_fJEU5vFtdgPhfJJF8Noku48MnUlN7PAQ_ubrU/pub?embedded=true",
    download:
      "https://docs.google.com/document/d/1yfU6dZ3drtCEXXvrgxtYv45oIOi_3FPJVW9P4lvG7Q4/export?format=pdf",
  },
  cn: {
    view: "https://docs.google.com/document/d/e/2PACX-1vQaIuqz3rC0RMX5lScTXaC-_QTuFSpWdespUU8l9N-r0up7GAWcMIK87MSBdYq4dqLoF8dGSanvFTDc/pub?embedded=true",
    download:
      "https://docs.google.com/document/d/1jofDkdlprKBrGWmcbqzMWpoFS3WNFu_hSwhZbAEXatQ/export?format=pdf",
  },
};

export default function CvViewer() {
  const [activeLang, setActiveLang] = useState("en");

  return (
    <Container className="relative h-screen w-full flex flex-col items-center px-4 py-">
      <Tabs
        defaultValue="en"
        className="w-full h-full flex flex-col items-center"
        onValueChange={(val) => setActiveLang(val)}
      >
        <div className="w-full max-w-4xl flex justify-between items-center py-4 px-4 sm:px-0">
          {/* The Tabs Switcher */}
          <TabsList className="grid  gap-2 grid-cols-2 ">
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="cn">中文 (Chinese)</TabsTrigger>
          </TabsList>

          <a
            href={cvConfig[activeLang].download}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md shadow-md transition-all active:scale-95 text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>
              {activeLang === "en" ? "Download CV (EN)" : "下载简历 (CN)"}
            </span>
          </a>
        </div>

        <div className="w-full flex-1 max-w-4xl bg-white shadow-xl overflow-hidden rounded-lg mb-6 border border-gray-200">
          <TabsContent value="en" className="w-full h-full m-0 p-0">
            <iframe
              className="w-full h-full border-none"
              title="English CV"
              src={cvConfig.en.view}
            />
          </TabsContent>

          <TabsContent value="cn" className="w-full h-full m-0 p-0">
            <iframe
              className="w-full h-full border-none"
              title="Chinese CV"
              src={cvConfig.cn.view}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Container>
  );
}
