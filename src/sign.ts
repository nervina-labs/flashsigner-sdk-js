import {
  PERSONAL,
  rawTransactionToHash,
  hexToBytes,
  serializeWitnessArgs,
  toUint64Le,
  scriptToAddress,
} from '@nervosnetwork/ckb-sdk-utils'
import resultFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/resultFormatter'
import paramsFormatter from '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import URL from 'url-parse'
import { MissingParamsError } from './errors'
import { Config } from './config'
import { FlashsignerAction } from './model'
import { SignTxResult } from './transfer'
import { FlashsignerLoginData } from '.'

export interface SignOptions {
  message: string
  isRaw?: boolean
  name?: string
  logo?: string
  id?: string
  locale?: string
  failUrl?: string
  isReplace?: boolean
  extra?: Record<string, any>
}

export interface SignTransactionOptions {
  tx: RPC.Transaction
  name?: string
  logo?: string
  id?: string
  locale?: string
  failUrl?: string
  isReplace?: boolean
  extra?: Record<string, any>
}

export const generateSignMessageURL = (
  successUrl: string,
  options: Omit<SignOptions, 'isReplace'> = { message: '' }
): string => {
  const { name, locale, logo, isRaw, id, extra, failUrl, message } = options
  const url = new URL(`${Config.getFlashsignerURL()}/sign-message`, true)
  const { query } = url
  const surl = new URL(successUrl, true)
  // surl.searchParams.set(
  //   'action',
  //   isRaw ? FlashsignerAction.SignRawMessage : FlashsignerAction.SignMessage
  // )
  surl.query.action = isRaw
    ? FlashsignerAction.SignRawMessage
    : FlashsignerAction.SignMessage
  if (extra) {
    // surl.searchParams.set('extra', JSON.stringify(extra))
    surl.query.extra = JSON.stringify(extra)
  }
  // searchParams.set('success_url', surl.toString())
  query.success_url = surl.toString()
  if (message === '') {
    throw new MissingParamsError('message')
  }
  // searchParams.set('message', message)
  query.message = message
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
  if (isRaw) {
    // searchParams.set('is_raw', Boolean(isRaw).toString())
    query.is_raw = Boolean(isRaw).toString()
  }
  if (failUrl) {
    // searchParams.set('fail_url', failUrl)
    query.fail_url = failUrl
  }
  const href = url.toString()

  return href
}

export const RSA_KEY_SIZE = 2048

const appendFlashsignerCelldeps = (cellDeps: RPC.CellDep[]) => {
  const flCellDep = Config.getCellDep()
  const newCellDeps = cellDeps.map(resultFormatter.toCellDep)
  if (
    newCellDeps.find(
      (dep) => dep.outPoint?.txHash === flCellDep.outPoint?.txHash
    )
  ) {
    return newCellDeps
  }
  newCellDeps.push(flCellDep)
  return newCellDeps
}

export const transactionToMessage = (transaction: RPC.RawTransaction) => {
  const cellDeps = appendFlashsignerCelldeps(transaction.cell_deps)
  const tx = {
    version: transaction.version,
    cellDeps,
    headerDeps: transaction.header_deps,
    inputs: transaction.inputs.map(resultFormatter.toInput),
    outputs: transaction.outputs.map(resultFormatter.toOutput),
    outputsData: transaction.outputs_data,
    witnesses: [] as any[],
  }
  tx.witnesses = tx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }
  )
  const witnessGroup = tx.witnesses

  if (!witnessGroup.length) {
    throw new Error('WitnessGroup cannot be empty')
  }
  if (typeof witnessGroup[0] !== 'object') {
    throw new Error(
      'The first witness in the group should be type of WitnessArgs'
    )
  }

  const transactionHash = rawTransactionToHash(tx)

  // len(smt_type + pub_key_e + pub_key_n + signature)
  const lockLength = 2 + 8 + (RSA_KEY_SIZE / 4) * 2

  const emptyWitness = {
    ...witnessGroup[0],
    lock: `0x${'0'.repeat(lockLength)}`,
  }

  const serializedEmptyWitnessBytes = hexToBytes(
    serializeWitnessArgs(emptyWitness)
  )
  const serializedEmptyWitnessSize = serializedEmptyWitnessBytes.length

  const hash = blake2b(32, null, null, PERSONAL)
  hash.update(hexToBytes(transactionHash))
  hash.update(
    hexToBytes(toUint64Le(`0x${serializedEmptyWitnessSize.toString(16)}`))
  )
  hash.update(serializedEmptyWitnessBytes)

  witnessGroup.slice(1).forEach((w: any) => {
    const bytes = hexToBytes(
      typeof w === 'string' ? w : serializeWitnessArgs(w)
    )
    hash.update(hexToBytes(toUint64Le(`0x${bytes.length.toString(16)}`)))
    hash.update(bytes)
  })

  const message = `${hash.digest('hex')}`

  return message
}

export const appendSignatureToTransaction = (
  transaction: RPC.RawTransaction,
  signedMessage: string
): RPC.RawTransaction => {
  const cellDeps = appendFlashsignerCelldeps(transaction.cell_deps)
  const tx = {
    version: transaction.version,
    cellDeps,
    headerDeps: transaction.header_deps,
    inputs: transaction.inputs.map(resultFormatter.toInput),
    outputs: transaction.outputs.map(resultFormatter.toOutput),
    outputsData: transaction.outputs_data,
    witnesses: [] as any[],
  }
  tx.witnesses = tx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: '', outputType: '' }
  )
  const witnessGroup = tx.witnesses

  if (!witnessGroup.length) {
    throw new Error('WitnessGroup cannot be empty')
  }
  if (typeof witnessGroup[0] !== 'object') {
    throw new Error(
      'The first witness in the group should be type of WitnessArgs'
    )
  }

  const transactionHash = rawTransactionToHash(tx)

  // len(smt_type + pub_key_e + pub_key_n + signature)
  const lockLength = 2 + 8 + (RSA_KEY_SIZE / 4) * 2

  const emptyWitness = {
    ...witnessGroup[0],
    lock: `0x${'0'.repeat(lockLength)}`,
  }

  const serializedEmptyWitnessBytes = hexToBytes(
    serializeWitnessArgs(emptyWitness)
  )
  const serializedEmptyWitnessSize = serializedEmptyWitnessBytes.length

  const hash = blake2b(32, null, null, PERSONAL)
  hash.update(hexToBytes(transactionHash))
  hash.update(
    hexToBytes(toUint64Le(`0x${serializedEmptyWitnessSize.toString(16)}`))
  )
  hash.update(serializedEmptyWitnessBytes)

  witnessGroup.slice(1).forEach((w: any) => {
    const bytes = hexToBytes(
      typeof w === 'string' ? w : serializeWitnessArgs(w)
    )
    hash.update(hexToBytes(toUint64Le(`0x${bytes.length.toString(16)}`)))
    hash.update(bytes)
  })

  const rsaType = RSA_KEY_SIZE === 2048 ? '01' : '02'

  emptyWitness.lock = `0x${rsaType}${signedMessage}`

  const signedWitnesses = [
    serializeWitnessArgs(emptyWitness),
    ...witnessGroup.slice(1),
  ]

  return paramsFormatter.toRawTransaction({
    ...tx,
    witnesses: signedWitnesses.map((witness) =>
      typeof witness === 'string' ? witness : serializeWitnessArgs(witness)
    ),
  })
}

export function getSignTxResult<T extends { tx: RPC.RawTransaction }>(
  data: FlashsignerLoginData,
  id?: string | null,
  extra?: T
) {
  const chainType = Config.getChainType()
  if (extra == null) {
    throw new Error('transaction is required')
  }
  const { tx: txToSign, ...restExtra } = extra
  const signedTx = appendSignatureToTransaction(txToSign, data.sig)
  const result: SignTxResult<Omit<T, 'tx'>> = {
    transaction: signedTx,
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
  if (restExtra && Object.keys(restExtra).length !== 0) {
    result.extra = restExtra
  }
  return result
}

export const generateSignTransactionURL = (
  successUrl: string,
  options: SignTransactionOptions
) => {
  const { tx, extra, ...rest } = options
  const href = generateSignMessageURL(successUrl, {
    ...rest,
    message: transactionToMessage(tx),
    extra: {
      ...extra,
      tx,
    },
  })

  const url = new URL(href, true)
  // const surl = new URL(url.searchParams.get('success_url')!)
  const surl = new URL(url.query.success_url!, true)
  // surl.searchParams.set('action', FlashsignerAction.SignTransaction)
  surl.query.action = FlashsignerAction.SignTransaction
  // url.searchParams.set('success_url', surl.toString())
  url.query.success_url = surl.toString()

  return url.toString()
}

export const signTransactionWithRedirect = (
  successUrl: string,
  options: SignTransactionOptions
) => {
  const { isReplace, ...rest } = options
  const href = generateSignTransactionURL(successUrl, rest)
  if (isReplace) {
    window.location.replace(href)
  } else {
    window.location.href = href
  }
  return href
}

export const signMessageWithRedirect = (
  successUrl: string,
  options: SignOptions = { message: '' }
): string => {
  const { isReplace, ...rest } = options
  const href = generateSignMessageURL(successUrl, rest)
  if (isReplace) {
    window.location.replace(href)
  } else {
    window.location.href = href
  }
  return href
}
