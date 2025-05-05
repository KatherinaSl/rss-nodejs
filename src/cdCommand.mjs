import { stat } from "node:fs/promises";
import { InvalidInputError } from "./utils/commandUtils.mjs";
import { validateOneArg, getCorrectPath } from "./utils/common.mjs";

const cdCommand = async (args, currentDir) => {
  validateOneArg(args);
  const pathToDirectory = args[0];
  const newPath = getCorrectPath(currentDir, pathToDirectory);

  const file = await stat(newPath);
  if (file.isDirectory()) return newPath;
  throw new InvalidInputError();
};

export default cdCommand;
