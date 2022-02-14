import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { Config } from './config'
import { FlashsignerAction, FlashsignerLoginData } from './model'

export interface LoginOptions {
  name?: string
  logo?: string
  id?: string
  phoneNumber?: string
  locale?: string
  failUrl?: string
  isReplace?: boolean
  extra?: Record<string, any>
}

export const generateLoginURL = (
  successUrl: string,
  options: Omit<LoginOptions, 'isReplace'> = {}
): string => {
  const { name, locale, logo, phoneNumber, id, extra, failUrl } = options
  const url = new URL(`${Config.getFlashsignerURL()}/connect`)
  const { searchParams } = url
  const surl = new URL(successUrl)
  surl.searchParams.set('action', FlashsignerAction.Login)
  if (extra) {
    surl.searchParams.set('extra', JSON.stringify(extra))
  }
  searchParams.set('success_url', surl.toString())
  if (name) {
    searchParams.set('dapp_name', name)
  }
  if (locale) {
    searchParams.set('locale', locale)
  }
  if (logo) {
    searchParams.set('dapp_logo', logo)
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
  const href = url.toString()

  return href
}

export const loginWithRedirect = (
  successUrl: string,
  options: LoginOptions = {}
): string => {
  const { isReplace, ...rest } = options
  const href = generateLoginURL(successUrl, rest)
  if (isReplace) {
    window.location.replace(href)
  } else {
    window.location.href = href
  }
  return href
}

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
    address: scriptToAddress(
      {
        hashType: data.lock.hash_type,
        codeHash: data.lock.code_hash,
        args: data.lock.args,
      },
      chainType === 'mainnet'
    ),
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
