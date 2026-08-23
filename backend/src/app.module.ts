import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [PrismaModule, ServicesModule],
})
export class AppModule {}
