import { Controller, Get, MessageEvent, Res, Sse } from '@nestjs/common'
import { Response } from 'express'
import { Observable, interval, map } from 'rxjs'

@Controller('buzzers')
export class BuzzersController {
  public constructor() {}

  @Get('ketchup')
  public async ketchup(@Res() res: Response): Promise<void> {
    return res.render('burger', { title: 'Ketchup' })
  }

  @Get('mayo')
  public async mayo(@Res() res: Response): Promise<void> {
    return res.render('burger', { title: 'Mayo' })
  }

  @Get('obs')
  public async obs(@Res() res: Response): Promise<Response> {
    return
  }

  @Sse('sse')
  public sse(): Observable<MessageEvent> {
    return interval(1000).pipe(map((_) => ({ data: { hello: 'world' } })))
  }
}
