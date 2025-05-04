import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";

const getHash = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const pathToFile = args[0];
  const newPathToFile = path.isAbsolute(pathToFile)
    ? pathToFile
    : path.resolve(currentDir, pathToFile);

  const hash = createHash("sha256");
  const readableStream = createReadStream(newPathToFile);
  await pipeline(readableStream, hash);

  const digest = hash.digest("hex");
  console.log(`Hash ${digest}`);
};

export default getHash;
