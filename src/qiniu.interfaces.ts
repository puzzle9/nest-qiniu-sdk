import { ModuleMetadata, Type } from '@nestjs/common'

import * as qiniu from 'qiniu'

export interface QiniuOptionsInterfaces {
  global?: boolean
  zone?: qiniu.conf.Zone
  access_key?: string
  secret_key?: string
  bucket?: string
  domain?: string
  mac_options?: {
    disableQiniuTimestampSignature?: boolean
  }

  [key: string]: any
}

export interface QiniuOptionsFactory {
  createQiniuOptions(): Promise<QiniuOptionsInterfaces> | QiniuOptionsInterfaces
}

export interface QiniuAsyncOptionsInterfaces extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<QiniuOptionsFactory>
  useClass?: Type<QiniuOptionsFactory>
  useFactory?: (...args: any[]) => Promise<QiniuOptionsInterfaces> | QiniuOptionsInterfaces
  inject?: any[]
}
