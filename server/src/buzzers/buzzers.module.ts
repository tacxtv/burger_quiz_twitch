import { Module } from '@nestjs/common'
import { BuzzersController } from './buzzers.controller'
import { BuzzersService } from './buzzers.service'

@Module({
  controllers: [BuzzersController],
  providers: [BuzzersService],
})
export class BuzzersModule {}
