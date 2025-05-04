import path from "node:path";
import { stat } from "node:fs/promises";
import { InvalidInputError } from "./utils/commandUtils.mjs";

const cdCommand = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const pathToDirectory = args[0];
  const newPath = path.isAbsolute(pathToDirectory)
    ? pathToDirectory
    : path.resolve(currentDir, pathToDirectory);

  const file = await stat(newPath);
  if (file.isDirectory()) return newPath;
  throw new InvalidInputError();
};

export default cdCommand;
