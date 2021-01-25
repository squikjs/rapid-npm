#!/usr/bin/env node

const { exec } = require("child_process");
const search = require("libnpmsearch");
const { green, yellow, red } = require("chalk");

var twirlTimer = function (name) {
  var P = ["◜", "◝", "◞", "◟"];
  var x = 0;

  const interval = setInterval(() => {
    process.stdout.write(`\r ${green(P[x++])} Installing ${yellow(name)}`);
    x &= 3;
  }, 250);

  return () => clearInterval(interval);
};

const install = async (name) => {
  if (name === null) return console.log(red`Sepcify Package name!`);
  const sr = await search(name);
  if (sr.length === 0) return console.log(red`Package ${name} not found!`);

  const ls = exec(`npm install ${sr[0].name}`);
  const timer = twirlTimer(sr[0].name);
  let installed = false;

  ls.stdout.on("data", function (data) {
    timer();
    if (installed === false) {
      console.log(`\n${green`✓`}  Installed ${yellow(sr[0].name)}`);
      installed = true;
    }
  });
};

const package = process.argv[2] ? process.argv[2] : null;
install(package);
