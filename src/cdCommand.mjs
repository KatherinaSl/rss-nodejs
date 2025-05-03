import path from "node:path";
import { stat } from "node:fs/promises";
import logErrorMsg from "./utils/errorHandle.mjs";

const cdCommand = async (input, currentDir) => {
  try {
    const pathToDirectory = input.slice(3).trim();
    if (!pathToDirectory) {
      return null; //todo error
    }
    const newPath = path.isAbsolute(pathToDirectory)
      ? pathToDirectory
      : path.resolve(currentDir, pathToDirectory);

    const file = await stat(newPath);
    if (file.isDirectory()) return newPath;
    return null; //todo error
  } catch (e) {
    console.log(e);
    logErrorMsg("Invalid input, these is no such directory", "error");
  }
};

export default cdCommand;
