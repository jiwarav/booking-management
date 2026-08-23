import { IsEmail, IsInt, IsNotEmpty, IsISO8601, Min } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsInt()
  @Min(1)
  serviceId: number;

  @IsISO8601()
  startTime: string;
}
