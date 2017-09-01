import fs from 'fs'
import babel from 'rollup-plugin-babel'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const pkg = JSON.parse(fs.readFileSync('./package.json'))
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

export default {
  entry: pkg['jsnext:main'] || 'src/index.js',
  dest: 'index.js',
  moduleName: pkg.amdName || pkg.name,
  format: process.env.FORMAT || 'umd',
  external,
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    nodeResolve({
      jsnext: true,
    }),
    commonjs({
      include: 'node_modules/**',
      extensions: ['.js'],
    }),
  ],
}
