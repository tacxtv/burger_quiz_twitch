import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'
import { Response } from 'express'
import { join } from 'path'
import { json } from 'body-parser'
import swagger from './swagger'
import { Logger } from '@nestjs/common'

declare const module: any
;(async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })
  app.use((_, res: Response, next: Function) => {
    res.removeHeader('x-powered-by')
    next()
  })

  app.use(json({ limit: '50mb' }))

  app.useStaticAssets(join(__dirname, '/../../public'))
  app.setViewEngine('pug')

  swagger(app)

  await app.listen(4000, async (): Promise<void> => {
    Logger.log('@tacxtv/burger_quiz_twitch is READY on <http://localhost:4000>')
  })

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose((): Promise<void> => app.close())
  }
})()
