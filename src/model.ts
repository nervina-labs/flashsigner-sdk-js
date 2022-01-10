export enum FlashsignerAction {
  Sign = 'sign',
  Login = 'login',
  TransferMnft = 'transfer-mnft',
}

export interface FlashsignerData {
  lock: CKBComponents.Script
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
  info: string
  result: FlashsignerLoginData | FlashsignerSignData
}

export type ChainType = 'mainnet' | 'testnet'
