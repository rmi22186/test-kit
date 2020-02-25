import base from "./node_modules/@mparticle/web-kit-wrapper/rollup.base";

export default [
  {
    input: base.input,
    output: {
      ...base.output,
      format: "iife",
      file: "dist/Branch-Kit.js",
      name: "mpBranchKit"
    },
    plugins: [...base.plugins]
  },
  {
    input: base.input,
    output: {
      ...base.output,
      format: "cjs",
      file: "dist/Branch-Kit.common.js",
      name: "mpBranchKit"
    },
    plugins: [...base.plugins]
  }
];
