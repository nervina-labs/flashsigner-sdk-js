# flashsigner-sdk-js

`flashsigner-sdk-js` 是一个用来与 Flashsigner 网站交互的库。

[Live demo](https://demo.flashsigner.com)

## 安装

```bash
$ npm i @nervina-labs/flashsigner-sdk @nervosnetwork/ckb-sdk-rpc @nervosnetwork/ckb-sdk-utils
# or
$ yarn add @nervina-labs/flashsigner-sdk @nervosnetwork/ckb-sdk-rpc @nervosnetwork/ckb-sdk-utils
```

## 用法

### 登录

#### `loginWithRedirect`

重定向到 flashsigner 网站并且登录。

```js
import { loginWithRedirect } from '@nervina-labs/flashsigner-sdk'

loginWithRedirect(successURL, options)
// 如果你在一个函数中调用，那可能在函数执行完毕后需要手动调用 return
```

##### options

* `successURL` — `string`: 成功登录后会跳转的 URL 地址
* `options` — `object`: 额外的参数
  * `name`: — `string, optional`: 你的应用名字
  * `logo` — `string, optional`:  你的应用 logo 的 URL
  * `phoneNumber` — `string, optional`: 指定一个手机号登录
  * `locale` — `string, optional`: 指定 flashsigner 显示的语言
  * `failUrl` — `string, optional`: 登录失败后会跳转的 URL 地址
  * `extra` — `object, optional`: 指定的额外的数据，flashsigner 会返回相同的 extra 数据到 `successURL`

#### `generateLoginURL`

生成一个登录 flashsigner 的 URL 地址

```js
import { generateLoginURL } from '@nervina-labs/flashsigner-sdk'

const url = generateLoginURL(successURL, options)
window.location.href = url
// or
window.location.replace(url)
```

`generateLoginURL` 的参数和 `loginWithRedirect` 的参数一样。

### 转让 NFT

#### `transferMnftWithRedirect`

重定向到 flashsigner 网站并且转让 mNFT。

```js
import { loginWithRedirect } from '@nervina-labs/flashsigner-sdk'

loginWithRedirect(successURL, options)
```

##### options

* `successURL` — `string`: 转让后会跳转的 URL 地址
* `options` — `object`:
  * `issuerId`: — `string, required`: 需要转让 NFT 的 issuer ID
  * `classId`: — `string, required`: 需要转让 NFT 的 class ID
  * `tokenId`: — `string, required`: 需要转让 NFT 的 token ID
  * `fromAddress`: — `string, required`: 需要转让 NFT 的持有人地址
  * `toAddress`: — `string, required`: 需要转让到的地址
  * `name`: — `string, optional`: 你的应用名字
  * `logo` — `string, optional`:  你的应用 logo 的 URL
  * `locale` — `string, optional`: 指定 flashsigner 显示的语言
  * `failUrl` — `string, optional`: 转让失败后会跳转的 URL 地址
  * `extra` — `object, optional`: 指定的额外的数据，flashsigner 会返回相同的 extra 数据到 `successURL`

#### `generateTransferMnftURL`

```js
import { generateTransferMnftURL } from '@nervina-labs/flashsigner-sdk'

const url = generateTransferMnftURL(successURL, options)
window.location.href = url
// or
window.location.replace(url)
```

### 签名

#### `signMessageWithRedirect`

重定向到 flashsigner 网站并签名。

```js
import { signMessageWithRedirect } from '@nervina-labs/flashsigner-sdk'

signMessageWithRedirect(successURL, options)
```

##### options

* `successURL` — `string`: 成功签名后会跳转的 URL 地址
* `options` — `object`:
  * `message`: — `string, required`: 需要签名的信息
  * `isRaw` — `string, optional`: 信息是否为 raw message，如果是的话，flashsigner 会把信息先转换为 hex 字符串再进行签名，否则 flashsigner 会直接对信息进行签名
  * `name`: — `string, optional`: 你的应用名字
  * `logo` — `string, optional`:  你的应用 logo 的 URL
  * `locale` — `string, optional`: 指定 flashsigner 显示的语言
  * `failUrl` — `string, optional`: 登录失败后会跳转的 URL 地址
  * `extra` — `object, optional`: 指定的额外的数据，flashsigner 会返回相同的 extra 数据到 `successURL`

#### `signTransactionWithRedirect`

重定向到 flashsigner 网站并对一个交易进行签名，

`signTransactionWithRedirect` 是 `signMessageWithRedirect` 的语法糖。

```js
import { signTransactionWithRedirect } from '@nervina-labs/flashsigner-sdk'

signTransactionWithRedirect(successURL, options)
// If called within a function, you may need to manually `return` after the `signTransactionWithRedirect` call.
```

##### options

* `successURL` — `string`: 成功签名后会跳转的 URL 地址
* `options` — `object`:
  * `tx`: — `RPC.RawTransaction, required`: 需要签名的交易
  * `logo` — `string, optional`:  你的应用 logo 的 URL
  * `phoneNumber` — `string, optional`: 指定一个手机号登录
  * `locale` — `string, optional`: 指定 flashsigner 显示的语言
  * `failUrl` — `string, optional`: 登录失败后会跳转的 URL 地址
  * `extra` — `object, optional`: 指定的额外的数据，flashsigner 会返回相同的 extra 数据到 `successURL`

### Get flashsigner response

#### `getResultFromURL`

从 `successURL` 或 `failURL` 中获取数据。

```js
import { getResultFromURL, FlashsignerAction } from '@nervina-labs/flashsigner-sdk'

getResultFromURL({
  onLogin(res) {
    const {
      // 当登录成功时，flashsigner 会对 dapp 网站地址和时间戳进行签名，
      // 并把要签名的信息和签名返回
      message,
      signature,
      // 已授权账户的公钥
      pubkey,
      // 已授权账户的地址
      address,
      // 请求登录时的额外数据
      extra,
    } = res
  },
  onTransferMnft(res) {
    const {
      // 已签名的交易
      transaction,
      // 已签名账户的地址
      address,
      // 请求签名时的额外数据
      extra,
    } = res
  },
  onSignTransaction(res) {
      // 已签名的交易
      transaction,
      // 已签名账户的地址
      address,
      // 请求签名时的额外数据
      extra,
    } = res
  },
  onSignMessage(res) {
    const {
      message,
      signature,
      // 已签名的公钥
      pubkey,
      // 已签名的地址
      address,
      // 请求签名时的额外数据
      extra,
    } = res
  },
  onSignRawMessage(res) {
    const {
      message,
      signature,
      // Authorized public key, can be used to verify signatures.
      pubkey,
      // Authorized CKB address
      address,
      // extra data specified by dapp at signing
      extra,
    } = res
  },
  onError(error: Error, action: FlashsignerAction, extra: object) {

  }
})
```

##### options

* `onLogin`: 登录成功时的回调函数
    * `result`:
        + `message` - `string`: 对 dapp 网站和时间戳的签名
        + `signature` - `string`
        + `address` - `string`: 已授权地址
        + `pubkey` - `string`: 已授权的公钥
        + `extra` - `object`: 请求登录时的额外数据
* `onTransferMnft`: 转让 NFT 成功时的回调函数
    * `result`:
        + `transaction` - `RPC.RawTransaction`: 已签名的交易
        + `address` - `string`: 已签名的地址
        + `extra` - `object`: 请求签名时的额外数据
* `onSignTransaction`: 签名交易成功时的回调函数
    * `result`:
        + `transaction` - `RPC.RawTransaction`: 已签名的交易
        + `address` - `string`: 已签名的地址
        + `extra` - `object`: 请求签名时的额外数据
* `onSignMessage`: 请求签名成功后的回调函数
    * `result`:
        + `message` - `string`
        + `signature` - `string`
        + `address` - `string`: 已授权地址
        + `pubkey` - `string`: 已授权的公钥
        + `extra` - `object`: 请求登录时的额外数据
* `onSignRawMessage`: 请求签名原始信息成功后的回调函数
    * `result`:
        + `message` - `string`
        + `signature` - `string`
        + `address` - `string`: 已授权地址
        + `pubkey` - `string`: 已授权的公钥
        + `extra` - `object`: 请求登录时的额外数据
* `onError`: 请求失败后的回调函数
  * `error` - `Error`
  * `action` - `FlashsignerAction`:  请求失败的行为
  * `extra` - `object` :  请求时的额外数据

### Config

`Config` 可以用来设置一些 Flashsigner 的配置，例如网站地址，chain type 等。

```js
import { Config } from '@nervina-labs/flashsigner-sdk'

// 大多数情况下你只需要在入口文件设置 chain type
// in your entry file
Config.setChainType('mainnet' /* or 'testnet' */)
```

More config can be found in [source](https://github.com/nervina-labs/flashsigner-sdk-js/blob/master/src/config.ts).

### Utils

#### `generateFlashsignerLockScript`

从公钥生成 lock script。

```js
import { generateFlashsignerLockScript } from '@nervina-labs/flashsigner-sdk'

const lock: CKBComponents.Script = generateFlashsignerLockScript(pubkey)
```

#### `generateFlashsignerAddress`

从公钥生成 CKB 地址。

```js
import { generateFlashsignerAddress } from '@nervina-labs/flashsigner-sdk'

const address: string = generateFlashsignerAddress(pubkey)
```

#### `transactionToMessage`

把交易序列化为 hex 字符串。

```js
import { transactionToMessage } from '@nervina-labs/flashsigner-sdk'

const message: string = transactionToMessage(tx)
```

#### `appendSignatureToTransaction`

把签名添加到交易的 witness 中。

```js
import { appendSignatureToTransaction } from '@nervina-labs/flashsigner-sdk'

const tx: RPC.RawTransaction = appendSignatureToTransaction(tx, sig)
// you can send the tx to the CKB node
```