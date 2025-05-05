import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import path, { join } from "node:path";
import { pipeline } from "node:stream/promises";
import { validateTwoArgs, getCorrectPath } from "./utils/common.mjs";

const compress = async (args, currentDir) => {
  validateTwoArgs(args);
  const sourceFilePath = args[0];
  const file = path.basename(sourceFilePath);

  const targetDirectory = join(args[1], `${file}.br`);

  const pathToFile = getCorrectPath(currentDir, sourceFilePath);
  const pathToArchive = getCorrectPath(currentDir, targetDirectory);

  let fileStream = createReadStream(pathToFile);
  let archiveStream = createWriteStream(pathToArchive, { flags: "wx" });
  let compress = createBrotliCompress();
  await pipeline(fileStream, compress, archiveStream);
};

const decompress = async (args, currentDir) => {
  validateTwoArgs(args);
  const sourceFilePath = args[0];
  const file = path.basename(sourceFilePath);

  const targetFilepath = join(args[1], file.split(".br")[0]);

  const pathToArchive = getCorrectPath(currentDir, sourceFilePath);
  const pathToFile = getCorrectPath(currentDir, targetFilepath);

  let archiveStream = createReadStream(pathToArchive);

  let fileStream = createWriteStream(pathToFile, { flags: "wx+" });
  let decompress = createBrotliDecompress();

  await pipeline(archiveStream, decompress, fileStream);
};

export { compress, decompress };
