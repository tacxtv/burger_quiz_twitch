import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config from './config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { BuzzersModule } from './buzzers/buzzers.module'
import { ScoresModule } from './scores/scores.module'
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose'
import { RedisModule } from '@nestjs-modules/ioredis'
import { RedisOptions } from 'ioredis'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: async (config: ConfigService) => {
    //     return {
    //       ...config.get<MongooseModuleOptions>('mongoose.options'),
    //       uri: config.get<string>('mongoose.uri'),
    //     }
    //   },
    // }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../..', 'app/.output/public'),
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        config: {
          ...config.get<RedisOptions>('ioredis.options'),
          url: config.get<string>('ioredis.uri'),
        },
      }),
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
