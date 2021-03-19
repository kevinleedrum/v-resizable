import commonjs from '@rollup/plugin-commonjs'
import buble from '@rollup/plugin-buble'

export default {
  input: 'src/index.js', // Path relative to package.json
  output: {
    file: 'dist/index.js',
    name: 'v-resizable',
    format: 'umd',
  },
  plugins: [commonjs(), buble()],
}
