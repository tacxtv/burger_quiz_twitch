import { Types } from 'mongoose'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  public transform(value: any): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) throw new BadRequestException('Invalid ObjectId')
    return <Types.ObjectId>Types.ObjectId.createFromHexString(value)
  }
}
