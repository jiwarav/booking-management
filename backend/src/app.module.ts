import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [PrismaModule, ServicesModule, BookingsModule],
})
export class AppModule {}
