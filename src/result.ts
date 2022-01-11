import {
  FlashsignerAction,
  FlashsignerLoginData,
  FlashsignerResponse,
  FlashsignerSignData,
  FLASHSIGNER_DATA_KEY,
} from './model'
import { LoginResult, getLoginResult } from './login'
import { SignTxResult, getTransferMnftResult } from './transfer'
import {
  InconsistAddressError,
  InvalidParamsError,
  MissingParamsError,
  UserRefuesedError,
} from './errors'
import { getSignTxResult } from './sign'

export interface GetResulFromURLOptions<T> {
  onLogin: (result: LoginResult<T>) => void
  onTransferMnft?: (result: SignTxResult<T>) => void
  onSignTransaction?: (result: SignTxResult<T>) => void
  onSignMessage?: (result: LoginResult<T>) => void
  onSignRawMessage?: (result: LoginResult<T>) => void
  onError?: (error: Error, action: FlashsignerAction) => void
}

export function getResultFromURL<T extends Record<string, any>>(
  options: GetResulFromURLOptions<T>
) {
  const {
    onLogin,
    onTransferMnft,
    onSignMessage,
    onSignRawMessage,
    onError,
    onSignTransaction,
  } = options
  const url = new URL(window.location.href)
  const { searchParams } = url
  const action: FlashsignerAction = searchParams.get(
    // eslint-disable-next-line comma-dangle
    'action'
  ) as FlashsignerAction
  if (action === null) {
    throw new Error('Missing dapp action')
  }
  const data = searchParams.get(FLASHSIGNER_DATA_KEY)
  const extra = searchParams.get('extra')
  const id = searchParams.get('id')
  const parsedExtra: T = extra ? JSON.parse(extra) : undefined

  if (data === null) {
    throw new Error('Missing dapp data')
  }
  const parsedData = JSON.parse(data) as FlashsignerResponse
  if (parsedData.code !== 200) {
    switch (parsedData.code) {
      case 401:
        onError?.(new UserRefuesedError(), action)
        break
      case 402:
        onError?.(new InconsistAddressError(), action)
        break
      case 403:
        onError?.(new InvalidParamsError(parsedData.error), action)
        break
      case 404:
        onError?.(new MissingParamsError(parsedData.error), action)
        break
      default:
        break
    }
    return
  }
  switch (action) {
    case FlashsignerAction.Login:
      onLogin(
        getLoginResult(
          parsedData.result as FlashsignerLoginData,
          id,
          parsedExtra
        )
      )
      break
    case FlashsignerAction.SignMessage:
      onSignMessage?.(
        getLoginResult(
          parsedData.result as FlashsignerLoginData,
          id,
          parsedExtra
        )
      )
      break
    case FlashsignerAction.SignRawMessage:
      onSignRawMessage?.(
        getLoginResult(
          parsedData.result as FlashsignerLoginData,
          id,
          parsedExtra
        )
      )
      break
    case FlashsignerAction.SignTransaction:
      onSignTransaction?.(
        getSignTxResult(
          parsedData.result as FlashsignerLoginData,
          id,
          parsedExtra as any
        )
      )
      break
    case FlashsignerAction.TransferMnft:
      onTransferMnft?.(
        getTransferMnftResult(
          parsedData.result as FlashsignerSignData,
          id,
          parsedExtra
        )
      )
      break
    default:
      throw new Error('invalid dapp action')
  }
}
