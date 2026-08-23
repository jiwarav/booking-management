import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { FindBookingsDto } from './dto/find-bookings.dto';

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
  findAll(@Query() query: FindBookingsDto) {
    return this.bookingsService.findAll(query);
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
