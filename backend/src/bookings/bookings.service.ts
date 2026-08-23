import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    customerName: string;
    customerEmail: string;
    serviceId: number;
    startTime: Date;
  }) {
    const service = await this.prisma.service.findUnique({
      where: { id: data.serviceId },
    });

    if (!service) {
      throw new NotFoundException(
        `Service with ID ${data.serviceId} not found`,
      );
    }

    const endTime = new Date(
      data.startTime.getTime() + service.duration * 60 * 1000,
    );

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        serviceId: data.serviceId,
        status: {
          not: 'CANCELLED',
        },
        startTime: {
          lt: endTime,
        },
        endTime: {
          gt: data.startTime,
        },
      },
    });

    if (conflictingBooking) {
      throw new BadRequestException(
        'This service is already booked for the selected time',
      );
    }

    return this.prisma.booking.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        serviceId: data.serviceId,
        startTime: data.startTime,
        endTime,
      },
      include: {
        service: true,
      },
    });
  }

  findAll() {
    return this.prisma.booking.findMany({
      orderBy: {
        startTime: 'asc',
      },
      include: {
        service: true,
      },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }
}
