import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";


// 1. Initialize Redis (Wrapped in try-catch logic later)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 2. Define Limits
const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "10 s"),
  analytics: true,
  prefix: "@upstash/api-limit",
});

// 3. Known Bot User-Agents to BLOCK immediately
const BLOCKED_USER_AGENTS = [
  "python-requests",
  "curl",
  "wget",
  "libwww-perl",
  "scrapy",
  "bot",
  "spider",
  "crawler",
];

export default async function middleware(request) {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  const userAgent = request.headers.get("user-agent")?.toLowerCase() || "";
  const path = request.nextUrl.pathname;

  // --- STEP 1: BLOCK BOTS ---
  const isBot = BLOCKED_USER_AGENTS.some((ua) => userAgent.includes(ua));
  const isGoodBot = userAgent.includes("googlebot") || userAgent.includes("bingbot");

  if (isBot && !isGoodBot) {
    return new NextResponse("Forbidden: Access Denied", { status: 403 });
  }

  // --- STEP 2: RATE LIMITING ---
  try {
    let limitResult = { success: true };

    // Apply strict limit to API routes, looser limit to pages
    if (path.startsWith("/api")) {
      limitResult = await apiLimiter.limit(ip);
    } else {
      limitResult = await globalLimiter.limit(ip);
    }

    if (!limitResult.success) {
      // Return a 429 Too Many Requests response
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limitResult.limit,
          "X-RateLimit-Remaining": limitResult.remaining,
          "Retry-After": "10",
        },
      });
    }
  } catch (error) {
    console.error("Rate limit error:", error);
  }

  // --- STEP 3: SECURITY HEADERS ---
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // HSTS (Force HTTPS) - Only enable this if you have a custom domain with SSL
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  return response;
}

// --- CONFIG ---
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};