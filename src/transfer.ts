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

export interface TransferCotaNftOptions
  extends Omit<LoginOptions, 'phoneNumber'> {
  cotaId: string
  tokenIndex: string | number
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
  surl.query.action = FlashsignerAction.TransferMnft
  if (extra) {
    surl.query.extra = JSON.stringify(extra)
  }
  query.success_url = surl.toString()
  query.class_id = classId
  query.issuer_id = issuerId
  query.token_id = tokenId
  query.to_address = toAddress
  query.from_address = fromAddress

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
  if (failUrl) {
    query.fail_url = failUrl
  }

  return url.toString()
}

export const generateTransferCotaNftURL = (
  successUrl: string,
  options: Omit<TransferCotaNftOptions, 'isReplace'>
) => {
  const {
    name,
    locale,
    logo,
    id,
    extra,
    failUrl,
    tokenIndex,
    cotaId,
    toAddress,
    fromAddress,
  } = options
  const url = new URL(`${Config.getFlashsignerURL()}/transfer-cnft`, true)
  const { query } = url
  const surl = new URL(successUrl, true)
  surl.query.action = FlashsignerAction.TransferMnft
  if (extra) {
    surl.query.extra = JSON.stringify(extra)
  }
  query.success_url = surl.toString()
  query.class_id = cotaId
  query.token_id = tokenIndex.toString()
  query.to_address = toAddress
  query.from_address = fromAddress

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
  if (failUrl) {
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

export const transferCotaNftWithRedirect = (
  successUrl: string,
  options: TransferCotaNftOptions
) => {
  const { isReplace, ...rest } = options
  const href = generateTransferCotaNftURL(successUrl, rest)
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
