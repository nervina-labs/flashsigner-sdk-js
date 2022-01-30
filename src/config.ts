import {
  FlashSignerLockTestnet,
  FlashSignerLockMainnet,
  PwLockMainnet,
  PwLockTestnet,
  FlashsignerCellDepsMainnet,
  FlashsignerCellDepsTestnet,
} from './const'
import { ChainType } from './model'

export class Config {
  private static flashsignerURL = 'https://flashsigner.com'

  private static flashsignerLock: CKBComponents.Script = FlashSignerLockMainnet

  private static chainType: ChainType = 'mainnet'

  private static pwcoreLock: CKBComponents.Script = PwLockMainnet

  private static cellDep: CKBComponents.CellDep = FlashsignerCellDepsMainnet

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

  public static setCellDep(cellDep: CKBComponents.CellDep) {
    Config.cellDep = cellDep
  }

  public static getCellDep() {
    return Config.cellDep
  }

  public static setChainType(type: ChainType) {
    Config.chainType = type
    if (type === 'testnet') {
      Config.setFlashsignerLock(FlashSignerLockTestnet)
      Config.setFlashsignerURL('https://staging.flashsigner.work')
      Config.setPwcoreLock(PwLockTestnet)
      Config.setCellDep(FlashsignerCellDepsTestnet)
    } else {
      Config.setFlashsignerLock(FlashSignerLockMainnet)
      Config.setFlashsignerURL('https://flashsigner.com')
      Config.setPwcoreLock(PwLockMainnet)
      Config.setCellDep(FlashsignerCellDepsMainnet)
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
