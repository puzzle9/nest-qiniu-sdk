import { QiniuOptionsInterfaces } from './qiniu.interfaces'
import { QINIU_MODULE_OPTIONS } from './qiniu.constants'

export function createQiniuProvider(options: QiniuOptionsInterfaces): any[] {
  return [{ provide: QINIU_MODULE_OPTIONS, useValue: options || {} }]
}
