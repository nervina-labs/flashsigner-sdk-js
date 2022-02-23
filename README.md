# flashsigner-sdk-js

`flashsigner-sdk-js` is a JavaScript library that interacts with `flashsigner.com`.

[Live demo](https://demo.flashsigner.work)

[中文文档](./README_CN.md)

## Install

```bash
$ npm i @nervina-labs/flashsigner @nervosnetwork/ckb-sdk-rpc @nervosnetwork/ckb-sdk-utils
# or
$ yarn add @nervina-labs/flashsigner @nervosnetwork/ckb-sdk-rpc @nervosnetwork/ckb-sdk-utils
```

## Usege

### Login

#### `loginWithRedirect`

Redirect to flashsigner.com and login.

```js
import { loginWithRedirect } from '@nervina-labs/flashsigner'

loginWithRedirect(successURL, options)
// If called within a function, you may need to manually `return` after the `loginWithRedirect` call.
```

##### options

* `successURL` — `string`: The URL that will be redirected after a successful login.
* `options` — `object`: additional settings.
  * `name`: — `string, optional`: your app name
  * `logo` — `string, optional`:  your app logo URL
  * `phoneNumber` — `string, optional`: Specify a mobile number to log in
  * `locale` — `string, optional`: Specify flashsigner.com display language
  * `failUrl` — `string, optional`: The url returned in case of a failed request
  * `extra` — `object, optional`: Some extra data specified by dapp, flashsigner will return the same extra data to `successURL`

#### `generateLoginURL`

Generate a URL that can be used to log in at flashsigner.

```js
import { generateLoginURL } from '@nervina-labs/flashsigner'

const url = generateLoginURL(successURL, options)
window.location.href = url
// or
window.location.replace(url)
```

`generateLoginURL` params is the same as `loginWithRedirect` params.

### Transfer NFT

#### `transferMnftWithRedirect`

Redirect to flashsigner.com and transfer mNFT.

```js
import { transferMnftWithRedirect } from '@nervina-labs/flashsigner'

transferMnftWithRedirect(successURL, options)
// If called within a function, you may need to manually `return` after the `loginWithRedirect` call.
```

##### options

* `successURL` — `string`: The URL that will be redirected after a successful transfer.
* `options` — `object`: additional settings.
  * `issuerId`: — `string, required`: The issue ID of the NFT to be transferred
  * `classId`: — `string, required`: The class ID of the NFT to be transferred
  * `tokenId`: — `string, required`: The token ID of the NFT to be transferred
  * `fromAddress`: — `string, required`: Address that NFT needs to be transferred from, can only be a CKB address
  * `toAddress`: — `string, required`: Address that NFT needs to be transferred to, can be a CKB address or ETH address
  * `name`: — `string, optional`: your app name
  * `logo` — `string, optional`:  your app logo URL
  * `locale` — `string, optional`: Specify flashsigner.com display language
  * `failUrl` — `string, optional`: The url returned in case of a failed request
  * `extra` — `object, optional`: Some extra data specified by dapp, flashsigner will return the same extra data to `successURL`

#### `generateTransferMnftURL`

```js
import { generateTransferMnftURL } from '@nervina-labs/flashsigner'

const url = generateTransferMnftURL(successURL, options)
window.location.href = url
// or
window.location.replace(url)
```

`generateTransferMnftURL` params is the same as `transferMnftWithRedirect` params.

### Sign

#### `signMessageWithRedirect`

Redirect to flashsigner.com and sign message.

```js
import { signMessageWithRedirect } from '@nervina-labs/flashsigner'

signMessageWithRedirect(successURL, options)
// If called within a function, you may need to manually `return` after the `signMessageWithRedirect` call.
```

#### `generateSignMessageURL`

Generate a url to flashsigner.com and sign message.

`generateSignMessageURL` params is the same as `signMessageWithRedirect` params.


```js
import { generateSignMessageURL } from '@nervina-labs/flashsigner'

const url generateSignMessageURL(successURL, options)
```

##### options

* `successURL` — `string`: The URL that will be redirected after sign message.
* `options` — `object`: additional settings.
  * `message`: — `string, required`: Message that need to be signed.
  * `isRaw` — `string, optional`: Whether the message is a raw message, If it is a raw message, flashsigner will convert the message to a hex string before signing it, Otherwise flashsigner will sign the message directly.
  * `name`: — `string, optional`: your app name
  * `logo` — `string, optional`:  your app logo URL
  * `locale` — `'zh' | 'en', optional`: Specify flashsigner.com display language
  * `failUrl` — `string, optional`: The url returned in case of a failed request
  * `extra` — `object, optional`: Some extra data specified by dapp, flashsigner will return the same extra data to `successURL`

#### `signTransactionWithRedirect`

Redirect to flashsigner.com and sign transaction.

`signTransactionWithRedirect` is the syntactic sugar of `signMessageWithRedirect`.

```js
import { signTransactionWithRedirect } from '@nervina-labs/flashsigner'

signTransactionWithRedirect(successURL, options)
// If called within a function, you may need to manually `return` after the `signTransactionWithRedirect` call.
```

#### `generateSignTransactionURL`

Generate a url to flashsigner.com and sign transaction.

`generateSignTransactionURL` params is the same as `signTransactionWithRedirect`.

##### options

* `successURL` — `string`: The URL that will be redirected after sign transaction.
* `options` — `object`: additional settings.
  * `tx`: — `RPC.RawTransaction, required`: Transaction that need to be signed.
  * `name`: — `string, optional`: your app name
  * `logo` — `string, optional`:  your app logo URL
  * `locale` — `string, optional`: Specify flashsigner.com display language
  * `failUrl` — `string, optional`: The url returned in case of a failed request
  * `extra` — `object, optional`: Some extra data specified by dapp, flashsigner will return the same extra data to `successURL`

### Get flashsigner response

#### `getResultFromURL`

Get the data returned by flashsigner.com from the `successURL` or `failURL`.

```js
import { getResultFromURL, FlashsignerAction } from '@nervina-labs/flashsigner'

// Note:
// If the first parameter is passed as a URL string,
// then the result is parsed from the passed string,
// and the second parameter must be passed as a callback options.
// If the first parameter is passed to callback options,
// the result is parsed from window.location.href.
getResultFromURL({
  onLogin(res) {
    const {
      // When the login is authorized,
      // flashsigner signs the current website origin and timestamp,
      // and returns the raw message and signature.
      message,
      signature,
      // Authorized public key, can be used to verify signatures.
      pubkey,
      // Authorized CKB address
      address,
      // extra data specified by dapp at login
      extra,
    } = res
  },
  onTransferMnft(res) {
    const {
      // signed transaction
      transaction,
      // Authorized CKB address
      address,
      // extra data specified by dapp at signing
      extra,
    } = res
  },
  onSignTransaction(res) {
    const {
      // signed transaction
      transaction,
      // Authorized CKB address
      address,
      // extra data specified by dapp at signing
      extra,
    } = res
  },
  onSignMessage(res) {
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

### Verify signature

```js
const NodeRsa = require('node-rsa')
const { Buffer } = require('buffer')

const signature = 'your signature'

const response = {
    "message": "{\"origin\":\"https://wallet.staging.nervina.cn\",\"timestamp\":\"1645548324662\"}",
    // If you are parsing the signature directly from the response url, you need to take the first 520 characters as pubkey
    "signature": signature.slice(520),
    "pubkey": signature.slice(0, 520)
}

const key = new NodeRsa()
const buf = Buffer.from(response.pubkey, 'hex')
const e = buf.slice(0, 4).reverse()
const n = buf.slice(4).reverse()
key.importKey({ e, n }, 'components-public')
key.setOptions({ signingScheme: 'pkcs1-sha256' })
const result = key.verify(
    Buffer.from(response.message),
    Buffer.from(response.signature, 'hex')
)

console.log(result)
```

##### options

* `onLogin`: Callback function for successful login
    * `result`:
        + `message` - `string`: a stringify JSON contains dapp website origin and timestamp
        + `signature` - `string`
        + `address` - `string`: Authorized CKB address
        + `pubkey` - `string`: Authorized public key, can be used to verify signatures.
        + `extra` - `object`: extra data specified by dapp at login
* `onTransferMnft`: Callback function for successful transfer mNFT
    * `result`:
        + `transaction` - `RPC.RawTransaction`: Signed transaction
        + `address` - `string`: Authorized CKB address
        + `extra` - `object`: extra data specified by dapp at signing
* `onSignTransaction`: Callback function for successful sign transaction
    * `result`:
        + `transaction` - `RPC.RawTransaction`: Signed transaction
        + `address` - `string`: Authorized CKB address
        + `extra` - `object`: extra data specified by dapp at signing
* `onSignMessage`: Callback function for successful sign message
    * `result`:
        + `message` - `string`
        + `signature` - `string`
        + `address` - `string`: Authorized CKB address
        + `pubkey` - `string`: Authorized public key, can be used to verify signatures.
        + `extra` - `object`: extra data specified by dapp at signing
* `onSignRawMessage`: Callback function for successful sign raw message
    * `result`:
        + `message` - `string`
        + `signature` - `string`
        + `address` - `string`: Authorized CKB address
        + `pubkey` - `string`: Authorized public key, can be used to verify signatures.
        + `extra` - `object`: extra data specified by dapp at signing
* `onError`: Callback function for failed action
  * `error` - `Error`
  * `action` - `FlashsignerAction`:  action where errors occur
  * `extra` - `object` :  extra data specified by dapp

### Config

`Config` can be used to set some configuration of Flashsigner, like chain type, flashsigner URL, flashsigner lock, etc.

```js
import { Config } from '@nervina-labs/flashsigner'

// In most cases you only need to set the chain type
// in your entry file
Config.setChainType('mainnet' /* or 'testnet' */)
```

More config can be found in [source](https://github.com/nervina-labs/flashsigner-sdk-js/blob/master/src/config.ts).

### Utils

#### `generateFlashsignerLockScript`

Generate the lock script from public key.

```js
import { generateFlashsignerLockScript } from '@nervina-labs/flashsigner'

const lock: CKBComponents.Script = generateFlashsignerLockScript(pubkey)
```

#### `generateFlashsignerAddress`

Generate the CKB address from public key.

```js
import { generateFlashsignerAddress } from '@nervina-labs/flashsigner'

const address: string = generateFlashsignerAddress(pubkey)
```

#### `transactionToMessage`

Serialize the transaction as a hex message.

```js
import { transactionToMessage } from '@nervina-labs/flashsigner'

const message: string = transactionToMessage(tx)
```

#### `appendSignatureToTransaction`

Adds a signature to the witness of an unsigned transaction.

```js
import { appendSignatureToTransaction } from '@nervina-labs/flashsigner'

const tx: RPC.RawTransaction = appendSignatureToTransaction(tx, sig)
// you can send the tx to the CKB node
```
