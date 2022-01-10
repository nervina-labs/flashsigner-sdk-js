import { bytesToHex, scriptToAddress } from '@nervosnetwork/ckb-sdk-utils'
import blake160 from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake160'
import { Config } from './config'

export const generateFlashsignerLockScript = (pubkey: string) => {
  const pubkeyHash = `${bytesToHex(blake160(`0x${pubkey}`))}`
  const lock = Config.getFlashsignerLock()
  return {
    ...lock,
    args: pubkeyHash,
  }
}

export const generateFlashsignerAddress = (pubkey: string) =>
  scriptToAddress(
    generateFlashsignerLockScript(pubkey),
    Config.getChainType() === 'mainnet'
  )
