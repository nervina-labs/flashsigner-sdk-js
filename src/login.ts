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
  extra?: Record<string, any>
}

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
