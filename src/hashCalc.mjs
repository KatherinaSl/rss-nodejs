import path from "node:path";
import { pipeline } from "node:stream/promises";
import { createReadStream } from "node:fs";
import { createHash } from "node:crypto";

const getHash = async (input, currentDir) => {
  const pathToFile = input.slice(5).trim();
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
