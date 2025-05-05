import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";
import { logMsg } from "./utils/messageHandler.mjs";
import { validateOneArg, getCorrectPath } from "./utils/common.mjs";

const getHash = async (args, currentDir) => {
  validateOneArg(args);
  const pathToFile = args[0];
  const newPathToFile = getCorrectPath(currentDir, pathToFile);

  const hash = createHash("sha256");
  const readableStream = createReadStream(newPathToFile);
  await pipeline(readableStream, hash);

  const digest = hash.digest("hex");
  logMsg(`Hash ${digest}`);
};

export default getHash;
