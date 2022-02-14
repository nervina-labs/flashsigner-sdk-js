# 微信小程序

[SDK 文档](./README_CN.md)

## Demo

安装微信小程序开发者工具，打开 [Flashsigner demo](https://developers.weixin.qq.com/s/cS9UR4m376xy)。

在微信开发者工具本地设置中，给「不校验合法域名、web-view(业务域名)、tls 版本以及 https 证书」选项打勾。

修改 `project.config.json` 的 `appid` 为自己的 appid，然后点击真机调试即可调试 demo。

## 教程

### 引用 Flashsigner

如果使用 Taro/uniapp 之类的框架，可以像 [Flashsigner Demo](https://github.com/nervina-labs/flashsigner-demo) 一样直接引用。如果没有，则需要把把 [UMD 包](https://unpkg.com/@nervina-labs/flashsigner@latest/dist/index.umd.js)复制到小程序目录下引用。

二者的区别在于，如果使用了框架，框架会自动根据使用到的 SDK 方法打包需要的 JS 文件，如果没有使用框架，则是全量打包。

### 新建一个 Flashsigner Page

在小程序中使用 Flashsigner 需要新建一个 Flashsigner page。他是一个 webview 页面的容器，专门处理 Flashsigner 相关的逻辑。在进行 Flashsigner 相关操作之前，需要跳转到 Flashsigner page。Flashsigner page 会从 Flashsigner Webview 中拿到相关数据，开发者需要自行根据产品的业务逻辑处理 Flashsigner 数据。

```typescript
const { generateLoginURL, Config, getLoginResult, FlashsignerAction } = require('/utils/flashsigner');

Config.setChainType('testnet')
// 如果是测试环境可以设置 flashsigner URL
// Config.setFlashsignerURL('https://staging.flashsigner.com')


Page({
  data: {
    // 可以自行设置路由参数，调用 sdk 生成不同的 url
    webviewUrl: generateLoginURL('https://wechat.flashsigner.com'),
  },
  getMessage(res: any) {
    const [data] = res.detail.data
    if (data.action === FlashsignerAction.Login) {
      // 得到 sdk 当中的 login result
      const loginResult = getLoginResult(data.result)
      console.log(loginResult)
      //
      const app = getApp<IAppOption>()
      app.globalData.address = loginResult.address
    }
    // else 处理签名/交易
  }
})
```

### 高级定制

默认情况下，Flashsigner 会调用 `wx.miniprogram.navigateBack()` 直接关闭 webview，但开发者可能需要自己决定 Flashsigner 登录/签名后跳转某个页面。这时开发者需要自行部署一个中转页面。中转页面是一个普通的 `index.html` 页面。例如：

```html
<!-- 这个 html 页面假设部署到 myapp.com/flashsigner -->
<!DOCTYPE html>
<html>
  <head>
    <title>My app</title>
  </head>
<!-- 添加微信 sdk -->
<script src="https://res.wx.qq.com/open/js/jweixin-1.6.0.js"></script>
<!-- 添加 flashsigner sdk，开发者可以把这个 js 文件自己部署到自己的服务器 -->
<script src="https://unpkg.com/@nervina-labs/flashsigner@latest/dist/index.umd.js"></script>
  <script>
    Flashsigner.getResultFromURL({
    onLogin(res) {
        wx.miniprogram.postMessage({
            data: res
        })
        wx.navigateTo('my login page')
    },
    onTransferMnft(res) {
        wx.miniprogram.postMessage({
            data: res
        })
        wx.navigateTo('my transfer page')
    },
    })
  </script>
  <body>
  </body>
</html>
```

然后在小程序的 webview 里，我们就可以生成一个跳转到中转页面的 URL。

```html
<!-- index.wxml -->
<web-view src="{{webviewURL}}" bindmessage="getMessage" />
```

```js
Page({
    data: {
        // 这里传入的参数，和最终部署的中转页面的 URL 一致
        loginURL: generateLoginURL("https://myapp.com/flashsigner")
    }
})
```
