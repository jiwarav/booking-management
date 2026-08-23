import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.service.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async getAvailability(id: number, date: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const bookings = await this.prisma.booking.findMany({
      where: {
        serviceId: id,
        status: {
          not: 'CANCELLED',
        },
        startTime: {
          lt: endOfDay,
        },
        endTime: {
          gt: startOfDay,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    const slots: string[] = [];

    const businessStart = 9 * 60;
    const businessEnd = 17 * 60;

    for (
      let minutes = businessStart;
      minutes + service.duration <= businessEnd;
      minutes += service.duration
    ) {
      const slotStart = new Date(startOfDay);
      slotStart.setUTCMinutes(minutes);

      const slotEnd = new Date(startOfDay);
      slotEnd.setUTCMinutes(minutes + service.duration);

      const hasConflict = bookings.some(
        (booking) => booking.startTime < slotEnd && booking.endTime > slotStart,
      );

      if (!hasConflict) {
        slots.push(slotStart.toISOString().substring(11, 16));
      }
    }

    return slots;
  }
}
