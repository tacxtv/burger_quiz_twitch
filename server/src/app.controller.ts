import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'
import { AppService } from './app.service'
import { Public } from './public.decorator'

@Public()
@Controller()
export class AppController {
  public constructor(private readonly service: AppService) {}

  @Get('info')
  public info(@Res() res: Response): Response {
    return res.json(this.service.getInfo())
  }
}
