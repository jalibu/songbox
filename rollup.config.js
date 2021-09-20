import banner2 from 'rollup-plugin-banner2'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

const pkg = require('./package.json')

const bannerText = `/*! *****************************************************************************
  ${pkg.name}
  Version ${pkg.version}
  ${pkg.description}
  (c) ${pkg.author ? pkg.author : pkg.contributors}
  Licence: ${pkg.license}
  This file is auto-generated. Do not edit.
***************************************************************************** */
`
export default [
  {
    input: './src/server/server.ts',
    plugins: [typescript({ module: 'ESNext' }), terser(), banner2(() => bannerText)],
    output: {
      file: './index.js',
      format: 'cjs'
    }
  }
]