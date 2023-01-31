# nest-qiniu-sdk

> qiniu sdk for nestjs

# 安装

```shell
yarn add nest-qiniu-sdk
```

# 使用

## 同步注册

```ts
// app.module.ts
import {Module} from '@nestjs/common'
import {AppController} from './app.controller'

import {QiniuModule, zone} from 'nest-qiniu-sdk'

@Module({
    imports: [
        QiniuModule.register({
            // 通常不用管区域
            // zone: zone.Zone_z0,
            global: true,
            access_key: 'access_key',
            secret_key: 'secret_key',
            bucket: 'bucket',
            domain: 'http://bucket.test',
        }),
    ],
    controllers: [AppController],
})
export class AppModule {
}
```

```ts
// app.controller.ts
import {Controller, Get} from '@nestjs/common'

import {QiniuService, util} from 'nest-qiniu-sdk'

@Controller()
export class AppController {
    constructor(private readonly QiniuService: QiniuService) {
    }

    @Get()
    hiQiniu(@Request() req): any {
        let options = this.QiniuService.getOptions(),
            access_key = this.QiniuService.getOptions('access_key'),
            secret_key = this.QiniuService.getOptions('secret_key'),
            zone = this.QiniuService.getZone(),
            bucket = this.QiniuService.getBucket(),
            domain = this.QiniuService.getDomain()

        /**
         * 具体文档参考 https://developer.qiniu.com/kodo/1289/nodejs
         * 大部分封装的不那么完美 建议根据源文档进行传参等配置 如 抓取网络资源到空间
         */
        let mac = this.QiniuService.mac(),
            cdnManager = this.QiniuService.cdnManager(),
            putPolicy = this.QiniuService.putPolicy({}),
            formUploader = this.QiniuService.formUploader(),
            bucketManager = this.QiniuService.bucketManager(),
            operationManager = this.QiniuService.operationManager()

        let key = 'file_path',
            // 过期时间 60秒
            expires = 60

        /**
         * 获取上传 token
         * https://developer.qiniu.com/kodo/1206/put-policy
         */
        let get_upload_token = this.QiniuService.getUploadToken({
            scope: bucket,
            insertOnly: 1,
            expires,
            // ...
        })

        // 获取公开空间下载地址
        let download_public_url = this.QiniuService.getPublicDownloadUrl(key)

        // 获取私有空间下载地址
        let download_private_url = this.QiniuService.getPrivateDownloadUrl(key, expires)

        // 判断是否为七牛回调
        let is_qiniu_callback = this.QiniuService.getIsQiniuCallback('request_full_url', req.headers['authorization'], req.body)

        // 抓取网络资源到空间
        let fetch_url = 'http://devtools.qiniu.com/qiniu.png'
        bucketManager.fetch(fetch_url, bucket, key, (err, respBody, respInfo) => {
            console.log(err, respBody, respInfo)
        })

        // 工具相关
        let isTimestampExpired = util.isTimestampExpired(1675274522)
    }
}

```

## 异步注册

- 学艺不精 待验证

# todo

- [ ] 优雅的封装 自动注入所需的 `bucket` `mac` `key` 等参数
- [ ] 支持 `Promise`

# 参考

- https://developer.qiniu.com/kodo/1289/nodejs
- https://github.com/nestjs/jwt
