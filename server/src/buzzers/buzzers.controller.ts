import { Controller, Get, MessageEvent, Res, Sse } from '@nestjs/common'
import { Response } from 'express'
import { Observable, interval, map } from 'rxjs'

@Controller('buzzers')
export class BuzzersController {
  public constructor() {}

  @Get('ketchup/:_id')
  public async ketchup(@Res() res: Response): Promise<void> {
    return
  }

  @Get('mayo/:_id')
  public async mayo(@Res() res: Response): Promise<void> {
    return
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
