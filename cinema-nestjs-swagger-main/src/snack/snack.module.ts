import { Module } from '@nestjs/common';
import { SnackService } from './snack.service';
import { SnackController } from './snack.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SnackController],
  providers: [SnackService],
})
export class SnackModule {}
