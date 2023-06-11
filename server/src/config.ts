import { MongooseModuleOptions } from '@nestjs/mongoose'
import { SwaggerCustomOptions } from '@nestjs/swagger'
import { HelmetOptions } from 'helmet'
import { RedisOptions } from 'ioredis'

export interface ConfigInstance {
  helmet: HelmetOptions
  mongoose: {
    uri: string
    options: MongooseModuleOptions
  }
  ioredis: {
    uri: string
    options: RedisOptions
  }
  swagger: {
    path: string
    api: string
    options?: SwaggerCustomOptions
  }
}

export default (): ConfigInstance => ({
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'self'"],
        frameSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'"],
        scriptSrc: ["'self'"],
      },
    },
  },
  mongoose: {
    uri: process.env.BQT_MONGOOSE_URI,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  ioredis: {
    uri: process.env.BQT_IOREDIS_URI,
    options: {
      showFriendlyErrorStack: true,
    },
  },
  swagger: {
    path: '/swagger',
    api: '/swagger/json',
    options: {
      swaggerOptions: {
        persistAuthorization: true,
      },
    },
  },
})
