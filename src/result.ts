import {
  FlashsignerAction,
  FlashsignerLoginData,
  FlashsignerResponse,
  FlashsignerSignData,
  FLASHSIGNER_DATA_KEY,
} from './model'
import { LoginResult, getLoginResult } from './login'
import { SignTxResult, getSignTxResult } from './transfer'
import {
  InconsistAddressError,
  InvalidParamsError,
  MissingParamsError,
  UserRefuesedError,
} from './errors'

export interface GetResulFromURLOptions<T> {
  onLogin: (result: LoginResult<T>) => void
  onTransferMnft?: (result: SignTxResult<T>) => void
  onSignMessage?: (result: LoginResult<T>) => void
  onError?: (error: Error) => void
}

export function getResultFromURL<T extends Record<string, any>>(
  options: GetResulFromURLOptions<T>
) {
  const { onLogin, onTransferMnft, onSignMessage, onError } = options
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
        onError?.(new UserRefuesedError())
        break
      case 402:
        onError?.(new InconsistAddressError())
        break
      case 403:
        onError?.(new InvalidParamsError(parsedData.error))
        break
      case 404:
        onError?.(new MissingParamsError(parsedData.error))
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
    case FlashsignerAction.Sign:
      onSignMessage?.(
        getLoginResult(
          parsedData.result as FlashsignerLoginData,
          id,
          parsedExtra
        )
      )
      break
    case FlashsignerAction.TransferMnft:
      onTransferMnft?.(
        getSignTxResult(
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
