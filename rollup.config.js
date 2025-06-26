import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser'; // ✅ default import

export default [
  {
    input: 'src/ore.js',
    output: {
      file: 'dist/ore.esm.js',
      format: 'esm',
    },
    plugins: [resolve()],
  },
  {
    input: 'src/ore.js',
    output: {
      file: 'dist/ore.umd.js',
      format: 'umd',
      name: 'Ore',
    },
    plugins: [
      resolve(),
      babel({
        babelHelpers: 'bundled',
        presets: [['@babel/preset-env']],
        exclude: 'node_modules/**',
      }),
      terser(), // ✅ works now
    ],
  },
];
