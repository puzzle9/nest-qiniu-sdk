import { Inject, Injectable, Logger, Optional } from '@nestjs/common'
import { QiniuOptionsInterfaces, QiniuAsyncOptionsInterfaces, QiniuOptionsFactory } from './qiniu.interfaces'
import { QINIU_MODULE_OPTIONS } from './qiniu.constants'

import * as qiniu from 'qiniu'

@Injectable()
export class QiniuService {
  constructor(
    @Optional()
    @Inject(QINIU_MODULE_OPTIONS)
    private readonly options: QiniuOptionsInterfaces = {},
  ) {}

  getOptions(key = null): QiniuOptionsInterfaces | any {
    return key ? this.options[key] : this.options
  }

  getZone(): qiniu.conf.Zone {
    return this.options.zone
  }

  getBucket(): string {
    return this.options.bucket
  }

  getDomain(): string {
    return this.options.domain
  }

  mac(): qiniu.auth.digest.Mac {
    return new qiniu.auth.digest.Mac(this.options.access_key, this.options.secret_key, this.options.mac_options)
  }

  config(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.conf.Config({
      zone: this.options.zone,
      ...config,
    })
  }

  cdnManager() {
    return new qiniu.cdn.CdnManager(this.mac())
  }

  putPolicy(options: qiniu.rs.PutPolicyOptions) {
    return new qiniu.rs.PutPolicy(options)
  }

  formUploader(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.form_up.FormUploader({
      ...this.config(),
      config,
    })
  }

  bucketManager(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.rs.BucketManager(this.mac(), {
      ...this.config(),
      config,
    })
  }

  operationManager(config?: qiniu.conf.ConfigOptions) {
    return new qiniu.fop.OperationManager(this.mac(), {
      ...this.config(),
      config,
    })
  }

  /**
   * 获取上传 token
   * @see https://developer.qiniu.com/kodo/1206/put-policy
   * @param options
   */
  getUploadToken(options: qiniu.rs.PutPolicyOptions): string {
    return this.putPolicy(options).uploadToken(this.mac())
  }

  /**
   * 获取公开空间下载地址
   * @param key
   */
  getPublicDownloadUrl(key: string): string {
    return this.bucketManager().publicDownloadUrl(this.getDomain(), key)
  }

  /**
   * 获取私有空间下载地址
   * @param key 文件路径
   * @param expires 过期时间 秒
   */
  getPrivateDownloadUrl(key: string, expires: number): string {
    return this.bucketManager().privateDownloadUrl(this.getDomain(), key, expires)
  }
}
