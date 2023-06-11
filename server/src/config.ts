import { SwaggerCustomOptions } from '@nestjs/swagger'
import { HelmetOptions } from 'helmet'

export interface ConfigInstance {
  helmet: HelmetOptions
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
