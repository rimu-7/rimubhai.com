// import { NextResponse } from "next/server";
// import { Ratelimit } from "@upstash/ratelimit";
// import { Redis } from "@upstash/redis";

// const redis = new Redis({
//   url: process.env.UPSTASH_REDIS_REST_URL,
//   token: process.env.UPSTASH_REDIS_REST_TOKEN,
// });

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(5, "10 s"),
//   analytics: true,
// });

// export default async function middleware(request) {
//   if (request.nextUrl.pathname.startsWith("/api")) {
//     const ip =
//       request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";

//     const { success } = await ratelimit.limit(ip);

//     if (!success) {
//       return NextResponse.json(
//         { error: "the first rules of the fight club is?" },
//         { status: 429 }
//       );
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/api/:path*",
// };

import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// 1. Initialize the database connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 2. Create the limit rule (e.g., 10 views per 60 seconds)
const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

export default async function middleware(request) {
  // 3. Get the user's IP
  const ip = request.ip || "127.0.0.1";

  // 4. Check the limit
  const { success } = await ratelimit.limit(ip);

  // 5. If they exceeded the limit, block the request
  if (!success) {
    return NextResponse.rewrite(new URL("/blocked", request.url));
  }

  // 6. If safe, let the frontend load
  return NextResponse.next();
}

// 7. Apply this only to the paths you want to protect
export const config = {
  // Apply to home page and dashboard, ignore static files like images/css
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
