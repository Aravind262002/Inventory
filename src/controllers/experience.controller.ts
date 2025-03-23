import { Controller, Get, Param, Query } from "@nestjs/common";
import { PrismaService } from "../services/prisma.service";

@Controller("api/v1/experience")
export class ExperienceController {
  constructor(private prisma: PrismaService) {}

  @Get(":id/slots")
  async getSlots(@Param("id") id: string, @Query("date") date: string) {
    const slots = await this.prisma.slot.findMany({
      where: { productId: parseInt(id), startDate: date },
      include: { slotPaxAvailabilities: { include: { paxType: true } } },
    });

    return slots.map((slot) => ({
      startTime: slot.startTime,
      startDate: slot.startDate,
      price: {
        finalPrice: slot.priceFinal,
        currencyCode: slot.currencyCode,
        originalPrice: slot.priceOriginal,
      },
      remaining: slot.remaining,
      paxAvailability: slot.slotPaxAvailabilities.map((pa) => ({
        type: pa.paxType.type,
        name: pa.paxType.name,
        description: pa.paxType.description,
        price: {
          finalPrice: pa.paxType.priceFinal,
          currencyCode: pa.paxType.currencyCode,
          originalPrice: pa.paxType.priceOriginal,
        },
        min: pa.paxType.min,
        max: pa.paxType.max,
        remaining: pa.remaining,
      })),
    }));
  }

  @Get(":id/dates")
  async getDates(@Param("id") id: string) {
    const dates = await this.prisma.slot.findMany({
      where: { productId: parseInt(id) },
      distinct: ["startDate"],
    });

    return {
      dates: dates.map((slot) => ({
        date: slot.startDate,
        price: {
          finalPrice: slot.priceFinal,
          currencyCode: slot.currencyCode,
          originalPrice: slot.priceOriginal,
        },
      })),
    };
  }
}
