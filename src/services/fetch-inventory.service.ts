import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "./prisma.service";
import * as dotenv from "dotenv";

dotenv.config();

@Injectable()
export class FetchInventoryService {
  private readonly logger = new Logger(FetchInventoryService.name);
  private readonly apiKey = process.env.API_KEY;

  constructor(private prisma: PrismaService) {}

  async fetchAndStore(productId: number, date: string) {
    try {
      const response = await axios.get(
        `https://leap-api.tickete.co/api/v1/inventory/${productId}?date=${date}`,
        {
          headers: { "x-api-key": process.env.API_KEY },
        }
      );

      const slots = response.data;

      await this.prisma.product.upsert({
        where: { id: productId },
        update: {},
        create: {
          id: productId,
          name: productId === 14 ? "Product 14" : "Product 15",
          timeSlotType: productId === 14 ? "MULTI" : "SINGLE",
        },
      });

      for (const slot of slots) {
        const dbSlot = await this.prisma.slot.upsert({
          where: {
            productId_startDate_startTime: {
              productId,
              startDate: slot.startDate,
              startTime: slot.startTime,
            },
          },
          update: {
            priceFinal: slot.paxAvailability[0].price.finalPrice,
            priceOriginal: slot.paxAvailability[0].price.originalPrice,
            currencyCode: slot.currencyCode,
            remaining: slot.remaining,
          },
          create: {
            productId,
            startDate: slot.startDate,
            startTime: slot.startTime,
            priceFinal: slot.paxAvailability[0].price.finalPrice,
            priceOriginal: slot.paxAvailability[0].price.originalPrice,
            currencyCode: slot.currencyCode,
            remaining: slot.remaining,
          },
        });

        for (const pax of slot.paxAvailability) {
          const paxType = await this.prisma.paxType.upsert({
            where: { productId_type: { productId, type: pax.type } },
            update: {},
            create: {
              productId,
              type: pax.type,
              name: pax.name,
              description: pax.description,
              priceFinal: pax.price.finalPrice,
              priceOriginal: pax.price.originalPrice,
              currencyCode: pax.price.currencyCode,
              min: pax.min,
              max: pax.max,
            },
          });

          await this.prisma.slotPaxAvailability.upsert({
            where: {
              slotId_paxTypeId: { slotId: dbSlot.id, paxTypeId: paxType.id },
            },
            update: { remaining: pax.remaining },
            create: {
              slotId: dbSlot.id,
              paxTypeId: paxType.id,
              remaining: pax.remaining,
            },
          });
        }
      }
      this.logger.log(`Synced product ${productId} for date ${date}`);
    } catch (err) {
      this.logger.error(`Failed syncing product ${productId} for ${date}`, err);
    }
  }
}
