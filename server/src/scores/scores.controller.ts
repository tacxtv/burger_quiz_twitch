import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Controller, Get, HttpStatus, Param, ParseIntPipe, Res, Sse } from '@nestjs/common'
import { Response } from 'express'
import { Types } from 'mongoose'
import { Observable, interval, map } from 'rxjs'
import { ParseObjectIdPipe } from '~/parseObjectId.pipe'

@Controller('scores')
export class ScoresController {
  public constructor(
    @InjectRedis() protected readonly redis: Redis,
  ) {}

  @Get('update/:team(ketchup|mayo)/:_id([0-9a-fA-F]{24})/:score')
  public async buzz(
    @Res() res: Response,
    @Param('team') team: string,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
    @Param('score', ParseIntPipe) score: number,
  ): Promise<Response> {
    const subscribe = ['bqt', 'scores', _id]
    this.redis.publish(subscribe.join(':'), JSON.stringify({ type: team, score }))
    //TODO: Enregistrer score
    return res.status(HttpStatus.CREATED).json({
      message: 'Updated !',
    })
  }

  @Get('obs')
  public async obs(@Res() res: Response): Promise<void> {
    return res.render('score')
  }

  @Sse('evt/:_id([0-9a-fA-F]{24})')
  public async sse(
    @Res() res: Response,
    @Param('_id', ParseObjectIdPipe) _id: Types.ObjectId,
  ): Promise<Observable<MessageEvent>> {
    const subscribe = ['bqt', 'scores', _id]
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
