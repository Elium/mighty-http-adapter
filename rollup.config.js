import typescript from "rollup-plugin-typescript";
import buble from "rollup-plugin-buble";

export default {
  entry: 'src/index.ts',
  external: ["lodash", "request", "@elium/mighty-js"],
  plugins: [
    typescript({tsconfig: false}),
    buble()
  ],
  targets: [
    {dest: 'lib/mighty-http-adapter.cjs.js', format: 'cjs', sourceMap: true},
    {dest: 'lib/mighty-http-adapter.umd.js', format: 'umd', sourceMap: true, moduleName: "mighty-http-adapter"},
    {dest: 'lib/mighty-http-adapter.es6.js', format: 'es', sourceMap: true}
  ]
}
