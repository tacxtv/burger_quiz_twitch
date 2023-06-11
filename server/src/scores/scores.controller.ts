import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller('scores')
export class ScoresController {
  public constructor() {}

  @Get('animateur')
  public async animateur(@Res() res: Response): Promise<Response> {
    return
  }

  @Get('grandmiam')
  public async grandmiam(@Res() res: Response): Promise<Response> {
    return
  }

  @Get('obs')
  public async obs(@Res() res: Response): Promise<Response> {
    return
  }
}
