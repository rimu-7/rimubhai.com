"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Loader2, FileText } from "lucide-react";
import Container from "@/components/Container";

const cvConfig = {
  en: {
    label: "English",
    view: "https://docs.google.com/document/d/e/2PACX-1vTh-acjHsVksRcFDHuptAOwRmML7Jv7rwVYjnEjTu_fJEU5vFtdgPhfJJF8Noku48MnUlN7PAQ_ubrU/pub?embedded=true",
    download:
      "https://docs.google.com/document/d/1yfU6dZ3drtCEXXvrgxtYv45oIOi_3FPJVW9P4lvG7Q4/export?format=pdf",
    doc: "https://docs.google.com/document/d/1yfU6dZ3drtCEXXvrgxtYv45oIOi_3FPJVW9P4lvG7Q4/view",
  },
  cn: {
    label: "中文",
    view: "https://docs.google.com/document/d/e/2PACX-1vQaIuqz3rC0RMX5lScTXaC-_QTuFSpWdespUU8l9N-r0up7GAWcMIK87MSBdYq4dqLoF8dGSanvFTDc/pub?embedded=true",
    download:
      "https://docs.google.com/document/d/1jofDkdlprKBrGWmcbqzMWpoFS3WNFu_hSwhZbAEXatQ/export?format=pdf",
    doc: "https://docs.google.com/document/d/1jofDkdlprKBrGWmcbqzMWpoFS3WNFu_hSwhZbAEXatQ/view",
  },
};

function IframeLoader({ src, title, onLoaded, onError }) {
  return (
    <iframe
      className="w-full h-full border-0"
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer"
      onLoad={onLoaded}
      onError={onError}
    />
  );
}

function LoadingOverlay({ label }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3 shadow-sm">
        <Loader2 className="h-5 w-5 animate-spin" />
        <div className="text-sm">
          <div className="font-medium text-gray-900">Loading {label} CV</div>
          <div className="text-gray-500">Rendering document…</div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ lang, openUrl }) {
  const copy =
    lang === "en"
      ? {
          title: "Couldn’t render the document",
          desc: "This can happen if the embed is blocked by the browser/network. You can still open it in a new tab or download the PDF.",
          open: "Open in new tab",
        }
      : {
          title: "无法渲染文档",
          desc: "可能是浏览器/网络阻止了嵌入渲染。你可以在新标签页打开，或直接下载 PDF。",
          open: "新标签页打开",
        };

  return (
    <div className="h-full w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="font-semibold text-gray-900">{copy.title}</div>
            <div className="text-sm text-gray-600 mt-1">{copy.desc}</div>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Button asChild className="rounded-xl">
            <a href={openUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {copy.open}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CvViewer() {
  const [activeLang, setActiveLang] = useState("en");

  // Track loading + error per language
  const [loaded, setLoaded] = useState({ en: false, cn: false });
  const [errored, setErrored] = useState({ en: false, cn: false });

  const active = useMemo(() => cvConfig[activeLang], [activeLang]);

  const markLoaded = useCallback((lang) => {
    setLoaded((p) => ({ ...p, [lang]: true }));
    setErrored((p) => ({ ...p, [lang]: false }));
  }, []);

  const markErrored = useCallback((lang) => {
    setErrored((p) => ({ ...p, [lang]: true }));
  }, []);

  return (
    <Container className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-semibold">
            Curriculum Vitae
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            View and download the latest version in English or Chinese.
          </p>
        </div>

        <Tabs
          value={activeLang}
          className="w-full"
          onValueChange={(val) => setActiveLang(val)}
        >
          {/* Sticky top bar */}
          <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 backdrop-blur border-b">
            <div className="flex items-center justify-between gap-3">
              <TabsList className="grid grid-cols-2 gap-2 rounded-xl">
                <TabsTrigger value="en" className="rounded-lg">
                  English
                </TabsTrigger>
                <TabsTrigger value="cn" className="rounded-lg">
                  中文
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button asChild className="rounded-xl">
                  <a href={active.download}>
                    <Download className="h-4 w-4 mr-2" />
                    {activeLang === "en" ? "Download PDF" : "下载 PDF"}
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Viewer Card */}
          <div className="mt-4 rounded-2xl border shadow-sm overflow-hidden">
            <div className="h-[75vh] sm:h-[78vh] relative">
              <TabsContent value="en" className="h-full m-0 p-0">
                {errored.en ? (
                  <ErrorState lang="en" openUrl={cvConfig.en.doc} />
                ) : (
                  <>
                    {!loaded.en && <LoadingOverlay label="English" />}
                    <IframeLoader
                      src={cvConfig.en.view}
                      title="English CV"
                      onLoaded={() => markLoaded("en")}
                      onError={() => markErrored("en")}
                    />
                  </>
                )}
              </TabsContent>

              <TabsContent value="cn" className="h-full m-0 p-0">
                {errored.cn ? (
                  <ErrorState lang="cn" openUrl={cvConfig.cn.doc} />
                ) : (
                  <>
                    {!loaded.cn && <LoadingOverlay label="Chinese" />}
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
