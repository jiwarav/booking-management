import { IsEnum } from 'class-validator';
import { BookingStatus } from '../../../generated/prisma/enums';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}