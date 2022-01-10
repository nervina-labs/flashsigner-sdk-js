import typescript from '@rollup/plugin-typescript'

const baseConfig = {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [typescript()],
  external: [
    '@nervosnetwork/ckb-sdk-utils',
    '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake160',
  ],
}

export default [
  baseConfig,
  {
    ...baseConfig,
    output: {
      file: 'dist/index.esm.js',
      format: 'esm',
    },
  },
]
