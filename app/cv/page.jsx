"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, FileText, Globe, Printer } from "lucide-react";
import Container from "@/components/Container";

// Updated with &rm=minimal to hide Google Docs UI
const cvConfig = {
  en: {
    label: "English",
    view: "https://docs.google.com/document/d/e/2PACX-1vTh-acjHsVksRcFDHuptAOwRmML7Jv7rwVYjnEjTu_fJEU5vFtdgPhfJJF8Noku48MnUlN7PAQ_ubrU/pub?embedded=true&rm=minimal",
    download: "https://docs.google.com/document/d/1yfU6dZ3drtCEXXvrgxtYv45oIOi_3FPJVW9P4lvG7Q4/export?format=pdf",
    doc: "https://docs.google.com/document/d/1yfU6dZ3drtCEXXvrgxtYv45oIOi_3FPJVW9P4lvG7Q4/view",
  },
  cn: {
    label: "中文",
    view: "https://docs.google.com/document/d/e/2PACX-1vQaIuqz3rC0RMX5lScTXaC-_QTuFSpWdespUU8l9N-r0up7GAWcMIK87MSBdYq4dqLoF8dGSanvFTDc/pub?embedded=true&rm=minimal",
    download: "https://docs.google.com/document/d/1jofDkdlprKBrGWmcbqzMWpoFS3WNFu_hSwhZbAEXatQ/export?format=pdf",
    doc: "https://docs.google.com/document/d/1jofDkdlprKBrGWmcbqzMWpoFS3WNFu_hSwhZbAEXatQ/view",
  },
};

function IframeLoader({ src, title, onLoaded, onError }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white">
      {/* The 'w-[120%] -left-[10%]' hack stretches the iframe and hides the 
          default Google Docs padding by pushing it outside the visible container.
      */}
      <iframe
        className="absolute inset-0 h-full w-[115%] -left-[7.5%] border-0 sm:w-[108%] sm:-left-[4%]"
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={onLoaded}
        onError={onError}
      />
    </div>
  );
}

function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
        Optimizing document view...
      </p>
    </div>
  );
}

function ErrorState({ lang, openUrl }) {
  const isEn = lang === "en";
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 p-6 text-center">
      <div className="max-w-sm">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm">
          <FileText className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          {isEn ? "Preview Unavailable" : "预览不可用"}
        </h3>
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {isEn 
            ? "Your browser is restricting the embedded view. You can still access the full document below." 
            : "浏览器限制了嵌入预览。您仍可以通过下方链接访问完整文档。"}
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild className="w-full py-6 text-md font-semibold shadow-lg">
            <a href={openUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-5 w-5" />
              {isEn ? "Open in New Tab" : "在新标签页打开"}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CvViewer() {
  const [activeLang, setActiveLang] = useState("en");
  const [loaded, setLoaded] = useState({ en: false, cn: false });
  const [errored, setErrored] = useState({ en: false, cn: false });

  const active = useMemo(() => cvConfig[activeLang], [activeLang]);

  const markLoaded = useCallback((lang) => {
    setLoaded((p) => ({ ...p, [lang]: true }));
  }, []);

  const markErrored = useCallback((lang) => {
    setErrored((p) => ({ ...p, [lang]: true }));
  }, []);

  return (
    <Container className="min-h-screen !px-0 sm:!px-4">
      <div className="mx-auto w-full max-w-5xl">
        
        {/* --- HEADER SECTION --- */}
        <div className="px-6 py-12 sm:px-0">
          <div className="flex items-center gap-2.5 text-primary mb-3">
            <div className="h-px w-8 bg-primary/30" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Curriculum Vitae</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Professional <span className="text-primary">Resume.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            I specialize in building high-performance web applications and 
            researching deep learning solutions for wireless systems.
          </p>
        </div>

        <Tabs
          value={activeLang}
          className="w-full"
          onValueChange={(val) => setActiveLang(val)}
        >
          {/* --- STICKY ACTION BAR --- */}
          <div className="sticky top-0 z-40 border-y bg-background/95 backdrop-blur-xl sm:rounded-t-3xl sm:border-x">
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <TabsList className="bg-muted/50 p-1 rounded-xl">
                <TabsTrigger value="en" className="px-5 py-2 text-sm font-medium rounded-lg data-[state=active]:shadow-md">
                  English
                </TabsTrigger>
                <TabsTrigger value="cn" className="px-5 py-2 text-sm font-medium rounded-lg data-[state=active]:shadow-md">
                  中文
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button asChild size="sm" className="rounded-xl px-5 font-bold shadow-indigo-500/10 shadow-lg">
                  <a href={active.download} download>
                    <Download className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Download PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden ">
            <div className="h-[75vh] md:h-[85vh] w-full">
              <TabsContent value="en" className="h-full m-0 p-0 focus-visible:outline-none">
                {errored.en ? (
                  <ErrorState lang="en" openUrl={cvConfig.en.doc} />
                ) : (
                  <>
                    {!loaded.en && <LoadingOverlay />}
                    <IframeLoader
                      src={cvConfig.en.view}
                      title="English CV"
                      onLoaded={() => markLoaded("en")}
                      onError={() => markErrored("en")}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="cn" className="h-full m-0 p-0 focus-visible:outline-none">
                {errored.cn ? (
                  <ErrorState lang="cn" openUrl={cvConfig.cn.doc} />
                ) : (
                  <>
                    {!loaded.cn && <LoadingOverlay />}
                    <IframeLoader
                      src={cvConfig.cn.view}
                      title="Chinese CV"
                      onLoaded={() => markLoaded("cn")}
                      onError={() => markErrored("cn")}
                    />
                  </>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </Container>
  );
}