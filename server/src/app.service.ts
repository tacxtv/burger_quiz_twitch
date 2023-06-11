import { Injectable } from '@nestjs/common'
import { readFileSync } from 'fs'
import { PackageJson } from 'types-package-json'

@Injectable()
export class AppService {
  private readonly package: Partial<PackageJson>

  public constructor() {
    this.package = JSON.parse(readFileSync('package.json', 'utf-8'))
  }

  public getInfo() {
    return {
      name: this.package.name,
      version: this.package.version,
    }
  }
}
