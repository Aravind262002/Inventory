import { Injectable } from "@nestjs/common";
import Bottleneck from "bottleneck";

@Injectable()
export class RateLimiterService {
  private limiter: Bottleneck;

  constructor() {
    this.limiter = new Bottleneck({
      minTime: 2100,
      maxConcurrent: 1,
      reservoir: 30,
      reservoirRefreshAmount: 30,
      reservoirRefreshInterval: 60 * 1000,
    });
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    return this.limiter.schedule(fn);
  }
}
