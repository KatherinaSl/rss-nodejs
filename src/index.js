import os from "node:os";
import * as readline from "node:readline";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import ls from "./ls.mjs";
import cdCommand from "./cdCommand.mjs";
import { logErrorMsg, logMsg } from "./utils/messageHandler.mjs";
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
import { getUserName } from "./utils/common.mjs";

const username = getUserName();
let currentDir = os.homedir();
const reader = readline.createInterface({ input, output });

logMsg(
  `Welcome to the File Manager, ${username ? username : os.userInfo().username}!`
);

logMsg(`You are currently in ${currentDir + os.EOL}`, "important");
logMsg(`Print command and wait for result ${os.EOL}`, "normal");

process.on("beforeExit", () => {
  logMsg(`Thank you for using File Manager, ${username}, goodbye!`);
});

reader.on("line", async (input) => {
  const params = getCommandParams(input);
  try {
    switch (params.command) {
      case ".exit":
        reader.close();
        break;
      case "up":
        const rootDir = path.parse(currentDir).root;
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
        logErrorMsg("Invalid input");
    }
  } catch (error) {
    if (error instanceof InvalidInputError) {
      logMsg(error.message, "error");
    } else {
      console.log(error);
      logMsg("Operation failed", "error");
    }
  }

  if (input !== ".exit") {
    logMsg(`You are currently in ${currentDir + os.EOL}`, "important");
    logMsg(`Print command and wait for result ${os.EOL}`, "normal");
  }
});
