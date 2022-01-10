import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import { Config } from './config'
import { FlashsignerAction, FlashsignerSignData } from './model'
import { LoginOptions } from './login'

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
