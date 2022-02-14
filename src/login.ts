import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import URL from 'url-parse'
import { Config } from './config'
import { FlashsignerAction, FlashsignerLoginData } from './model'

export interface LoginOptions {
  name?: string
  logo?: string
  id?: string
  phoneNumber?: string
  locale?: string
  failUrl?: string
  isReplace?: string
  extra?: Record<string, any>
}

export const generateLoginURL = (
  successUrl: string,
  options: Omit<LoginOptions, 'isReplace'> = {}
): string => {
  const { name, locale, logo, phoneNumber, id, extra, failUrl } = options
  const url = new URL(`${Config.getFlashsignerURL()}/connect`, true)
  const { query } = url
  const surl = new URL(successUrl, true)
  surl.query.action = FlashsignerAction.Login
  if (extra) {
    surl.query.extra = JSON.stringify(extra)
  }
  query.success_url = surl.toString()
  if (name) {
    query.dapp_name = name
  }
  if (locale) {
    query.locale = locale
  }
  if (logo) {
    query.dapp_logo = logo
  }
  if (id) {
    query.id = id
  }
  if (phoneNumber) {
    query.phone_number = phoneNumber
  }
  if (failUrl) {
    query.fail_url = failUrl
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
