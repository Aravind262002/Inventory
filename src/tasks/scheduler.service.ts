import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FetchInventoryService } from "../services/fetch-inventory.service";
import { format, addDays } from "date-fns";

@Injectable()
export class SchedulerService {
  constructor(private fetchService: FetchInventoryService) {}

  @Cron("*/15 * * * *")
  async fetchToday() {
    const date = format(new Date(), "yyyy-MM-dd");
    await this.fetchForProducts([14, 15], date);
  }

  @Cron("0 */4 * * *")
  async fetchNext7Days() {
    for (let i = 0; i < 7; i++) {
      const date = format(addDays(new Date(), i), "yyyy-MM-dd");
      await this.fetchForProducts([14, 15], date);
    }
  }

  @Cron("0 0 * * *")
  async fetchNext30Days() {
    for (let i = 0; i < 30; i++) {
      const date = format(addDays(new Date(), i), "yyyy-MM-dd");
      await this.fetchForProducts([14, 15], date);
    }
  }

  private async fetchForProducts(products: number[], date: string) {
    for (const productId of products) {
      await this.fetchService.fetchAndStore(productId, date);
      await new Promise((res) => setTimeout(res, 2100));
    }
  }
}
