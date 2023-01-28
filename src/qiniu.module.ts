import { DynamicModule, Module, Provider } from '@nestjs/common'

import { QiniuOptionsInterfaces, QiniuAsyncOptionsInterfaces, QiniuOptionsFactory } from './qiniu.interfaces'
import { QINIU_MODULE_OPTIONS } from './qiniu.constants'
import { createQiniuProvider } from './qiniu.providers'
import { QiniuService } from './qiniu.service'

@Module({
  providers: [QiniuService],
  exports: [QiniuService],
})
export class QiniuModule {
  static register(options: QiniuOptionsInterfaces): DynamicModule {
    return {
      global: options.global,
      module: QiniuModule,
      providers: createQiniuProvider(options),
    }
  }

  static registerAsync(options: QiniuAsyncOptionsInterfaces): DynamicModule {
    return {
      module: QiniuModule,
      imports: options.imports || [],
      providers: this.createAsyncProviders(options),
    }
  }

  private static createAsyncProviders(options: QiniuAsyncOptionsInterfaces): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: QiniuAsyncOptionsInterfaces): Provider {
    if (options.useFactory) {
      return {
        provide: QINIU_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }
    return {
      provide: QINIU_MODULE_OPTIONS,
      useFactory: async (optionsFactory: QiniuOptionsFactory) => await optionsFactory.createQiniuOptions(),
      inject: [options.useExisting || options.useClass],
    }
  }
}
