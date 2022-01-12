export const FlashSignerLockTestnet: CKBComponents.Script = {
  codeHash:
    '0x577a5e5930e2ecdd6200765f3442e6119dc99e87df474f22f13cab819c80b242',
  hashType: 'type',
  args: '',
}

export const FlashSignerLockMainnet: CKBComponents.Script = {
  codeHash:
    '0x081dbffa88dab54ba426d231ca64eb760cea2fe9e16761a1da400da1b2cbe128',
  hashType: 'type',
  args: '',
}

export const FlashsignerCellDepsTestnet: CKBComponents.CellDep = {
  depType: 'depGroup',
  outPoint: {
    index: '0x0',
    txHash:
      '0xb66776ff3244033fcd15312ae8b17d384c11bebbb923fce3bd896d89f4744d48',
  },
}

export const FlashsignerCellDepsMainnet: CKBComponents.CellDep = {
  depType: 'depGroup',
  outPoint: {
    index: '0x0',
    txHash:
      '0x0f0c22372a05f3c5f47acb066c65f9bae86bdce043762310e50309cc5a77abd4',
  },
}

export const PwLockTestnet: CKBComponents.Script = {
  hashType: 'type',
  codeHash:
    '0x58c5f491aba6d61678b7cf7edf4910b1f5e00ec0cde2f42e0abb4fd9aff25a63',
  args: '',
}

export const PwLockMainnet: CKBComponents.Script = {
  hashType: 'type',
  codeHash:
    '0xbf43c3602455798c1a61a596e0d95278864c552fafe231c063b3fabf97a8febc',
  args: '',
}
