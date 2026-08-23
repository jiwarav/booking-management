import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @Body()
    body: CreateBookingDto,
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

  @Patch(':id')
  update(
    @Param('id')
    id: string,
    @Body() body: UpdateBookingDto,
  ) {
    return this.bookingsService.update(id, body.status);
  }
}
