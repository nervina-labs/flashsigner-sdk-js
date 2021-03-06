import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const baseConfig = {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript(), nodeResolve(), commonjs()],
  external: [
    '@nervosnetwork/ckb-sdk-utils',
    '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake160',
    '@nervosnetwork/ckb-sdk-rpc/lib/resultFormatter',
    '@nervosnetwork/ckb-sdk-rpc/lib/paramsFormatter',
    '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b',
    '@ckb-lumos/base',
    'ckb-js-toolkit',
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
