import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { Config } from './config'
import {
  FlashsignerAction,
  FlashsignerLoginData,
  FlashsignerResponse,
  FlashsignerSignData,
} from './model'

export interface LoginOptions {
  name?: string
  logo?: string
  id?: string
  phoneNumber?: string
  locale?: string
  failUrl?: string
  extra?: Record<string, any>
}

export { Config }

export const loginWithRedirect = (
  successUrl: string,
  options: LoginOptions = {}
): void => {
  const { name, locale, logo, phoneNumber, id, extra, failUrl } = options
  const url = new URL(`${Config.getFlashsignerURL()}/connect`)
  const { searchParams } = url
  searchParams.set('action', FlashsignerAction.Login)
  searchParams.set('success_url', successUrl)
  if (name) {
    searchParams.set('name', name)
  }
  if (locale) {
    searchParams.set('locale', locale)
  }
  if (logo) {
    searchParams.set('logo', logo)
  }
  if (id) {
    searchParams.set('id', id)
  }
  if (phoneNumber) {
    searchParams.set('phone_number', phoneNumber)
  }
  if (failUrl) {
    searchParams.set('fail_url', failUrl)
  }
  if (extra) {
    searchParams.set('extra', JSON.stringify(extra))
  }
  window.location.replace(url.toString())
}

export interface TransferMnftOptions extends Omit<LoginOptions, 'phoneNumber'> {
  issuerId: string
  classId: string
  tokenId: string
  fromAddress: string
  toAddress: string
}

export const transferMnftWithRedirect = (
  successUrl: string,
  options: TransferMnftOptions
) => {
  const {
    name,
    locale,
    logo,
    id,
    extra,
    failUrl,
    classId,
    issuerId,
    toAddress,
    tokenId,
    fromAddress,
  } = options
  const url = new URL(`${Config.getFlashsignerURL()}/transfer-mnft`)
  const { searchParams } = url
  searchParams.set('action', FlashsignerAction.TransferMnft)
  searchParams.set('success_url', successUrl)
  searchParams.set('class_id', classId)
  searchParams.set('issuer_id', issuerId)
  searchParams.set('token_id', tokenId)
  searchParams.set('to_address', toAddress)
  searchParams.set('from_address', fromAddress)

  if (name) {
    searchParams.set('name', name)
  }
  if (locale) {
    searchParams.set('locale', locale)
  }
  if (logo) {
    searchParams.set('logo', logo)
  }
  if (id) {
    searchParams.set('id', id)
  }
  if (failUrl) {
    searchParams.set('fail_url', failUrl)
  }
  if (extra) {
    searchParams.set('extra', JSON.stringify(extra))
  }
  window.location.replace(url.toString())
}

export const FLASHSIGNER_DATA_KEY = 'flashsigner_data'

export interface LoginResult<T> {
  message: string
  signature: string
  address: string
  pubkey: string
  id?: string
  extra?: T
}

export function getLoginResult<T>(
  data: FlashsignerLoginData,
  id?: string | null,
  extra?: T
): LoginResult<T> {
  const chainType = Config.getChainType()
  const result: LoginResult<T> = {
    message: data.message,
    signature: data.sig,
    address: scriptToAddress(data.lock, chainType === 'mainnet'),
    pubkey: data.sig.slice(0, 520),
  }
  if (id) {
    result.id = id
  }
  if (extra) {
    result.extra = extra
  }
  return result
}

export interface SignTxResult<T> {
  transaction: RPC.RawTransaction
  id?: string
  address: string
  extra?: T
}

export function getSignTxResult<T>(
  data: FlashsignerSignData,
  id?: string | null,
  extra?: T
): SignTxResult<T> {
  const chainType = Config.getChainType()
  const result: SignTxResult<T> = {
    transaction: data.tx,
    address: scriptToAddress(data.lock, chainType === 'mainnet'),
  }
  if (id) {
    result.id = id
  }
  if (extra) {
    result.extra = extra
  }
  return result
}

export interface GetResulFromURLOptions<T> {
  onLogin: (result: LoginResult<T>) => void
  onTransferMnft?: (result: SignTxResult<T>) => void
  onSignMessage?: (result: LoginResult<T>) => void
  onError?: (error: Error) => void
}

export function getResultFromURL<T extends Record<string, any>>(
  options: GetResulFromURLOptions<T>
) {
  const { onLogin, onTransferMnft, onSignMessage } = options
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
