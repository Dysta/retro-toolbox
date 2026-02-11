import { RateLimiterMemory } from "rate-limiter-flexible";

export const rateLimiter = new RateLimiterMemory({
  points: 3, // 3 requests
  duration: 30, // per 30 seconds
});

const MAX_JOBS = 5;
let currentJobs = 0;

export async function secureRoute(
  req: Request,
  fn: () => Promise<Response>,
): Promise<Response> {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  try {
    await rateLimiter.consume(ip);
  } catch (err) {
    return new Response("Too Many Requests", { status: 429 });
  }

  if (currentJobs >= MAX_JOBS) {
    return new Response("Server Busy", { status: 503 });
  }

  currentJobs++;
  try {
    const response = await fn();
    return response;
  } finally {
    currentJobs--;
  }
}
