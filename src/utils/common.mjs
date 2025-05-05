import os from "node:os";
import path from "node:path";
import { InvalidInputError } from "./commandUtils.mjs";

const getUserName = () => {
  let username = "";
  if (process.argv.length > 2) {
    const processArgv = process.argv.slice(2);
    username = processArgv[0].split("=")[1];
  } else {
    username = os.userInfo().username;
  }

  return username;
};

const getCorrectPath = (currentDir, pathToFile) => {
  return path.isAbsolute(pathToFile)
    ? pathToFile
    : path.resolve(currentDir, pathToFile);
};

const validateOneArg = (args) => {
  if (args.length !== 1 || !args[0]) throw new InvalidInputError();
};

const validateTwoArgs = (args) => {
  if (args.length !== 2 || !args[0] || !args[1]) throw new InvalidInputError();
};

export { getUserName, getCorrectPath, validateOneArg, validateTwoArgs };
