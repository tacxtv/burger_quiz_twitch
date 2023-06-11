import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import config from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BuzzersModule } from './buzzers/buzzers.module'
import { ScoresModule } from './scores/scores.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    BuzzersModule,
    ScoresModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
