import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser'; // ✅ default import

export default [
  {
    input: 'src/ore-tag.js',
    output: {
      file: 'dist/ore-tag.esm.js',
      format: 'esm',
    },
    plugins: [resolve()],
  },
  {
    input: 'src/ore-tag.js',
    output: {
      file: 'dist/ore-tag.umd.js',
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
