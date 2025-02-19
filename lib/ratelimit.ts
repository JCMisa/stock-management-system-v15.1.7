import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/utils/redis";

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(1, "2m"), // how many request can a user do in span of 2 minutes
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export default ratelimit;
