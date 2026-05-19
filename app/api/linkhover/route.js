import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Global cache and browser singleton
const requestQueue = [];
let isProcessing = false;
const CACHE = new Map();

// Keep a persistent browser instance alive
let globalBrowser = null;

async function getBrowser() {
  if (!globalBrowser) {
    globalBrowser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      headless: "new",
    });
  }
  return globalBrowser;
}

async function processQueue() {
  if (isProcessing || requestQueue.length === 0) return;
  isProcessing = true;

  while (requestQueue.length > 0) {
    const { url, resolve, reject } = requestQueue.shift();

    try {
      if (CACHE.has(url)) {
        resolve(CACHE.get(url));
      } else {
        const screenshot = await takeScreenshot(url);
        CACHE.set(url, screenshot);
        resolve(screenshot);
      }
    } catch (error) {
      console.error(`[Error] ${url}:`, error.message);
      reject(error);
    }
  }

  isProcessing = false;
}

async function takeScreenshot(url) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  try {
    await page.setViewport({ width: 1280, height: 800 });
    
    // networkidle2 is faster than waiting for complete load
    await page.goto(url, { waitUntil: "networkidle2", timeout: 15000 });

    // Stop all animations to prevent blurring
    await page.evaluate(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
          scroll-behavior: auto !important;
        }
        ::-webkit-scrollbar { display: none; }
      `;
      document.head.appendChild(style);
    });

    // Output as WebP - 3x smaller size, loads much faster on the client
    const screenshot = await page.screenshot({ 
      fullPage: true,
      type: 'webp',
      quality: 75 
    });
    
    return screenshot;
  } finally {
    // ALWAYS close the page to prevent memory leaks
    await page.close();
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const screenshot = await new Promise((resolve, reject) => {
      requestQueue.push({ url, resolve, reject });
      processQueue();
    });

    return new NextResponse(screenshot, {
      headers: {
        "Content-Type": "image/webp",
        // Tell the browser to cache this aggressively for 1 week
        "Cache-Control": "public, max-age=604800, immutable", 
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 },
    );
  }
}