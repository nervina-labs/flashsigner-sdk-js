import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import URL from 'url-parse'
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

export const generateTransferMnftURL = (
  successUrl: string,
  options: Omit<TransferMnftOptions, 'isReplace'>
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
  const url = new URL(`${Config.getFlashsignerURL()}/transfer-mnft`, true)
  const { query } = url
  const surl = new URL(successUrl, true)
  // surl.searchParams.set('action', FlashsignerAction.TransferMnft)
  surl.query.action = FlashsignerAction.TransferMnft
  if (extra) {
    // surl.searchParams.set('extra', JSON.stringify(extra))
    surl.query.extra = JSON.stringify(extra)
  }
  // searchParams.set('success_url', surl.toString())
  // searchParams.set('class_id', classId)
  // searchParams.set('issuer_id', issuerId)
  // searchParams.set('token_id', tokenId)
  // searchParams.set('to_address', toAddress)
  // searchParams.set('from_address', fromAddress)
  query.success_url = surl.toString()
  query.class_id = classId
  query.issuer_id = issuerId
  query.token_id = tokenId
  query.to_address = toAddress
  query.from_address = fromAddress

  if (name) {
    // searchParams.set('dapp_name', name)
    query.dapp_name = name
  }
  if (locale) {
    // searchParams.set('locale', locale)
    query.locale = locale
  }
  if (logo) {
    // searchParams.set('dapp_logo', logo)
    query.dapp_logo = logo
  }
  if (id) {
    // searchParams.set('id', id)
    query.id = id
  }
  if (failUrl) {
    // searchParams.set('fail_url', failUrl)
    query.fail_url = failUrl
  }

  return url.toString()
}

export const transferMnftWithRedirect = (
  successUrl: string,
  options: TransferMnftOptions
) => {
  const { isReplace, ...rest } = options
  const href = generateTransferMnftURL(successUrl, rest)
  if (isReplace) {
    window.location.replace(href)
  } else {
    window.location.href = href
  }
}

export interface SignTxResult<T> {
  transaction: RPC.RawTransaction
  id?: string
  address: string
  extra?: T
}

export function getTransferMnftResult<T>(
  data: FlashsignerSignData,
  id?: string | null,
  extra?: T
): SignTxResult<T> {
  const chainType = Config.getChainType()
  const result: SignTxResult<T> = {
    transaction: data.tx,
    address: scriptToAddress(
      {
        hashType: data.lock.hash_type,
        codeHash: data.lock.code_hash,
        args: data.lock.args,
      },
      chainType === 'mainnet'
    ),
  }
  if (id) {
    result.id = id
  }
  if (extra) {
    result.extra = extra
  }
  return result
}
