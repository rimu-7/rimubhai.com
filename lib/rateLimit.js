const trackers = new Map();

export function rateLimit(ip) {
  const now = Date.now();
  const WINDOW_SIZE = 60 * 1000;
  const MAX_REQUESTS = 5;

  const record = trackers.get(ip);

  if (!record || now > record.expiresAt) {
    trackers.set(ip, {
      count: 1,
      expiresAt: now + WINDOW_SIZE,
    });
    return { success: true };
  }

  if (record.count >= MAX_REQUESTS) {
    return { success: false };
  }

  record.count++;
  return { success: true };
}

if (!global.rateLimitInterval) {
  global.rateLimitInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of trackers.entries()) {
      if (now > record.expiresAt) {
        trackers.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}
