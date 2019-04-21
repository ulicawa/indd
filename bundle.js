const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const resolve = require('rollup-plugin-node-resolve');
const cleanup = require('rollup-plugin-cleanup');
const commonJS = require('rollup-plugin-commonjs');
const glob = require("glob");

const srcDir = "./src";
const distDir = "./dist";

// ./src以下のjsファイルのリストを取得する。ただし_から始まるファイルとmodulesディレクトリは除外する。
const entries = glob.sync("*.js", {
  ignore: ["modules/**/*.js", "**/_*.js"],
  cwd: srcDir
});

//リストアップしたjsファイルをバンドルする。
for (let entry of entries) {
  const inputOptions = {
    input: path.resolve(srcDir, entry),
    plugins: [
      resolve(),
      commonJS({
        include: 'node_modules/**'
      }),
      babel(),
      cleanup(),
    ]
  };
  const outputOptions = {
    format: "cjs",
    file: path.resolve(distDir, entry.replace('.js','.jsx')),
  };
  build(inputOptions, outputOptions);
}

async function build(inputOptions, outputOptions) {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}