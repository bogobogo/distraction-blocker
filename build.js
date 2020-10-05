#!/usr/bin/env node
const { build } = require("estrella")
build({
  entry: ["src/content/content.tsx", "src/options.tsx", "src/background/background.ts"],
  outdir: "./build",
  bundle: true,
  sourcemap: true,
  minify: false,
  define: {
    "process.env.NODE_ENV": "development"
  },
})
