import {
  FlashSignerLockTestnet,
  FlashSignerLockMainnet,
  PwLockMainnet,
  PwLockTestnet,
} from './const'
import { ChainType } from './model'

export class Config {
  private static flashsignerURL = 'https://flashsigner.com'

  private static flashsignerLock: CKBComponents.Script = FlashSignerLockMainnet

  private static chainType: ChainType = 'mainnet'

  private static pwcoreLock: CKBComponents.Script = PwLockMainnet

  public static getFlashsignerURL() {
    return Config.flashsignerURL
  }

  public static setFlashsignerURL(url: string) {
    Config.flashsignerURL = url
  }

  public static setFlashsignerLock(lock: CKBComponents.Script) {
    Config.flashsignerLock = lock
  }

  public static getFlashsignerLock() {
    return Config.flashsignerLock
  }

  public static setChainType(type: ChainType) {
    Config.chainType = type
    if (type === 'testnet') {
      Config.setFlashsignerLock(FlashSignerLockTestnet)
      Config.setFlashsignerURL('https://staging.flashsigner.work')
      Config.setPwcoreLock(PwLockTestnet)
    } else {
      Config.setFlashsignerLock(FlashSignerLockMainnet)
      Config.setFlashsignerURL('https://flashsigner.com')
      Config.setPwcoreLock(PwLockMainnet)
    }
  }

  public static getChainType() {
    return Config.chainType
  }

  public static setPwcoreLock(lock: CKBComponents.Script) {
    Config.pwcoreLock = lock
  }

  public static getPwcoreLock() {
    return Config.pwcoreLock
  }
}
