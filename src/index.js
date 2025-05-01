import os from "node:os";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import { stat } from "node:fs/promises";
import ls from "./ls.mjs";
import cat from "./cat.mjs";

let currentDir = os.homedir();
const processArgv = process.argv.slice(2);
const username = processArgv[0].split("=")[1];
console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${currentDir + os.EOL}`);
console.log("Print command and wait for result");

const reader = readline.createInterface({ input, output });

process.on("beforeExit", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

reader.on("line", async (input) => {
  if (input === ".exit") {
    reader.close();
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  }

  const rootDir = path.parse(currentDir).root;

  if (input === "up") {
    if (currentDir !== rootDir) {
      currentDir = path.dirname(currentDir);
    } else {
      console.log("Already at root directory. Cannot go higher.");
    }
  }

  if (input === "ls") {
    await ls(currentDir);
  }

  if (input.startsWith("cd ")) {
    const pathToDirectory = input.slice(3).trim();
    const newPath = path.isAbsolute(pathToDirectory)
      ? pathToDirectory
      : path.resolve(currentDir, pathToDirectory);

    const file = await stat(newPath);
    if (file.isDirectory()) currentDir = newPath;
  }

  if (input.startsWith("cat ")) {
    await cat(input, currentDir);
  }

  console.log(`You are currently in ${currentDir + os.EOL}`);
  console.log("Print command and wait for result");
});
