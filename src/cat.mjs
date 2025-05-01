import path from "node:path";
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stdout } from "node:process";
import os from "node:os";

const cat = async (input, currentDir) => {
  const pathToFile = input.slice(4).trim();
  // console.log(
  //   `new path ${path.resolve(dirname(fileURLToPath(import.meta.url)), pathToFile)}`
  // );
  const newPath = path.resolve(currentDir, pathToFile);
  const readableStream = createReadStream(newPath);
  readableStream.on("end", () => process.stdout.write(os.EOL));
  await pipeline(readableStream, stdout, { end: false });
};

export default cat;
