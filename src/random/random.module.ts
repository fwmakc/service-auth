import { Module } from '@nestjs/common';
import { RandomController } from '@src/random/random.controller';
import { RandomService } from '@src/random/random.service';

@Module({
  controllers: [RandomController],
  imports: [],
  providers: [RandomService],
  exports: [RandomService],
})
export class RandomModule {}
