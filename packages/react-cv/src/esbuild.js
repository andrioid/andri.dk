#!/usr/bin/env node

// The package script was becoming hard to grasp
// This file should encapsulate all of the bundle/build tooling in one place
//
// I wish we could code without this crap, but we can't; so here we are

const esbuild = require("esbuild");

// Expects "resume.json" and "profile.jpg"
const RESUME_DIR = process.env["RESUME_DIR"] || '"../static/"';
console.log("resume dir", RESUME_DIR);

/**
 *
 * @param {"pdf" | "web"} platform - Platform to build for
 */
async function build() {
  await esbuild.build({
    entryPoints: ["src/build.tsx"],
    bundle: true,
    define: {
      RESUME_DIR: RESUME_DIR,
    },
    target: "node14",
    platform: "node",
    outfile: `dist/build.js`,
    sourcemap: true,
    legalComments: "external",
  });
}

async function buildWeb() {}

async function main() {
  try {
    await build();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
