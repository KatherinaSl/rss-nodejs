import os from "node:os";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import ls from "./ls.mjs";
import cdCommand from "./cdCommand.mjs";
import { logErrorMsg, logMsg } from "./utils/errorHandle.mjs";
import {
  cat,
  addFile,
  createFolder,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
} from "./basicFilesOp.mjs";
import { osInfo } from "./osInfo.mjs";
import getHash from "./hashCalc.mjs";
import { compress, decompress } from "./zip.mjs";
import { getCommandParams, InvalidInputError } from "./utils/commandUtils.mjs";

let currentDir = os.homedir();
const processArgv = process.argv.slice(2);
const username = processArgv[0].split("=")[1];
console.log(
  `Welcome to the File Manager, ${username ? username : os.userInfo().username}!`
);
console.log(`You are currently in ${currentDir + os.EOL}`);
console.log(`Print command and wait for result ${os.EOL}`);
const rootDir = path.parse(currentDir).root;
const reader = readline.createInterface({ input, output });

process.on("beforeExit", () => {
  console.log(`Thank you for using File Manager, ${username}, goodbye!`);
});

reader.on("line", async (input) => {
  const params = getCommandParams(input);
  // console.log(params);
  try {
    switch (params.command) {
      case ".exit":
        reader.close();
        break;
      case "up":
        if (currentDir !== rootDir) currentDir = path.dirname(currentDir);
        break;
      case "ls":
        await ls(currentDir);
        break;
      case "cd":
        currentDir = await cdCommand(params.args, currentDir);
        break;
      case "cat":
        await cat(params.args, currentDir);
        break;
      case "add":
        await addFile(params.args, currentDir);
        break;
      case "mkdir":
        await createFolder(params.args, currentDir);
        break;
      case "rn":
        await renameFile(params.args, currentDir);
        break;
      case "cp":
        await copyFile(params.args, currentDir);
        break;
      case "mv":
        await moveFile(params.args, currentDir);
        break;
      case "rm":
        await deleteFile(params.args, currentDir);
        break;
      case "os":
        osInfo(params.args);
        break;
      case "hash":
        await getHash(params.args, currentDir);
        break;
      case "compress":
        await compress(params.args, currentDir);
        break;
      case "decompress":
        await decompress(params.args, currentDir);
        break;
      case "none":
        break;
      default:
        logErrorMsg("Invalid input", "important");
    }
  } catch (error) {
    if (error instanceof InvalidInputError) {
      logMsg(error.message, "error");
    } else {
      console.log(error);
      logMsg("Operation failed", "error");
    }
  }
  console.log(`You are currently in ${currentDir + os.EOL}`);
  console.log(`Print command and wait for result ${os.EOL}`);
});

// const COMMANDS = [
//   ".exit",
//   "up",
//   "cd",
//   "ls",
//   "cat",
//   "add",
//   "mkdir",
//   "rn",
//   "cp",
//   "mv",
//   "rm",
//   "os",
//   "hash",
//   "compress",
//   "decompress",
// ];
