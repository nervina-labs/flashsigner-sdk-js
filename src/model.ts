export enum FlashsignerAction {
  SignMessage = 'sign-message',
  SignRawMessage = 'sign-raw-message',
  SignTransaction = 'sign-transaction',
  Login = 'login',
  TransferMnft = 'transfer-mnft',
}

export interface FlashsignerData {
  lock: RPC.Script
}

export interface FlashsignerLoginData extends FlashsignerData {
  sig: string
  message: string
}

export interface FlashsignerSignData extends FlashsignerData {
  tx: RPC.RawTransaction
}

export interface FlashsignerResponse {
  code: number
  error?: string
  result: FlashsignerLoginData | FlashsignerSignData
}

export type ChainType = 'mainnet' | 'testnet'

export const FLASHSIGNER_DATA_KEY = 'flashsigner_data'
