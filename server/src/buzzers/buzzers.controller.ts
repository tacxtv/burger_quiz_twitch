import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Controller, Get, HttpStatus, MessageEvent, Param, Res, Sse } from '@nestjs/common'
import { Response } from 'express'
import { Types } from 'mongoose'
import { Observable, interval, map } from 'rxjs'
import { ParseObjectIdPipe } from '~/parseObjectId.pipe'

@Controller('buzzers')
export class BuzzersController {
  public constructor(
    @InjectRedis() protected readonly redis: Redis,
  ) {}

  @Get('buzz/:team(ketchup|mayo)/:_id([0-9a-fA-F]{24})')
  public async buzz(
    @Res() res: Response,
    @Param('team') team: string,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<Response> {
    const subscribe = ['bqt', 'buzzers', _id]
    const buzzed = await this.redis.get([...subscribe, 'lock'].join(':'))
    if (buzzed) {
      return res.status(HttpStatus.CONFLICT).json({
        message: 'Already buzzed',
        buzzed: JSON.parse(buzzed),
      })
    }
    const timeToExpire = 5
    const unlock = Date.now() + (timeToExpire * 1000)
    this.redis.setex([...subscribe, 'lock'].join(':'), timeToExpire, JSON.stringify({
      team,
      unlock,
    }))
    this.redis.publish(subscribe.join(':'), JSON.stringify({ type: team }))
    return res.status(HttpStatus.CREATED).json({
      message: 'Buzzed !',
      unlock,
    })
  }

  @Get('obs')
  public async obs(@Res() res: Response): Promise<void> {
    return res.render('buzzer')
  }

  @Sse('evt/:_id([0-9a-fA-F]{24})')
  public async sse(
    @Res() res: Response,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<Observable<MessageEvent>> {
    const subscribe = ['bqt', 'buzzers', _id]
    const subscriber = this.redis.duplicate()
    return new Observable((observer) => {
      subscriber.subscribe(subscribe.join(':'), (err, count) => {
        if (err) observer.error(err)
      })
      subscriber.on('message', (channel, message) => {
        try {
          observer.next({ data: { channel, payload: JSON.parse(message)}} as MessageEvent)
        } catch (error) {
          observer.error(error)
        }
      })
    })
  }
}
