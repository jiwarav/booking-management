import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Body()
    body: {
      customerName: string;
      customerEmail: string;
      serviceId: number;
      startTime: string;
    },
  ) {
    return this.bookingsService.create({
      ...body,
      serviceId: Number(body.serviceId),
      startTime: new Date(body.startTime),
    });
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }
}
