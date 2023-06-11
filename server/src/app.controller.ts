import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { AppService } from './app.service'
import { Public } from './public.decorator'

@Public()
@Controller()
export class AppController {
  public constructor(private readonly service: AppService) {}

  @Get()
  public root(@Res() res: Response): Response {
    return res.json(this.service.getInfo())
  }
}
