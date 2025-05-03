import os from "node:os";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import ls from "./ls.mjs";
import cdCommand from "./cdCommand.mjs";
import logErrorMsg from "./utils/errorHandle.mjs";
import {
  cat,
  addFile,
  createFolder,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
} from "./basicFilesOp.mjs";

let currentDir = os.homedir();
const processArgv = process.argv.slice(2);
const username = processArgv[0].split("=")[1];
console.log(
  `Welcome to the File Manager, ${username ? username : os.userInfo().username}!`
);
console.log(`You are currently in ${currentDir + os.EOL}`);
// console.log(`Print command and wait for result ${os.EOL}`);
const rootDir = path.parse(currentDir).root;
const reader = readline.createInterface({ input, output });

process.on("beforeExit", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

reader.on("line", async (input) => {
  const command = input.split(" ")[0];
  switch (command) {
    case ".exit":
      reader.close();
      //   console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      break;
    case "up":
      if (currentDir !== rootDir) {
        currentDir = path.dirname(currentDir);
      } else {
        logErrorMsg("Already at root directory. Cannot go higher.", "info");
      }
      break;
    case "ls":
      await ls(currentDir);
      break;
    case "cd":
      currentDir = await cdCommand(input, currentDir);
      break;
    case "cat":
      await cat(input, currentDir);
      break;
    case "add":
      await addFile(input, currentDir);
      break;
    case "mkdir":
      await createFolder(input, currentDir);
      break;
    case "rn":
      await renameFile(input, currentDir);
      break;
    case "cp":
      await copyFile(input, currentDir);
      break;
    case "mv":
      await moveFile(input, currentDir);
      break;
    case "rm":
      await deleteFile(input, currentDir);
      break;
    default:
      logErrorMsg("Invalid input", "important");
  }
  console.log(`You are currently in ${currentDir + os.EOL}`);
  //   console.log(`Print command and wait for result ${os.EOL}`);
});
