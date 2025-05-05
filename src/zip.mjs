import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import path, { join } from "node:path";
import { pipeline } from "node:stream/promises";

const compress = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const sourceFilePath = args[0];
  const file = path.basename(sourceFilePath);

  const targetDirectory = join(args[1], `${file}.br`);

  const pathToFile = path.isAbsolute(sourceFilePath)
    ? sourceFilePath
    : path.resolve(currentDir, sourceFilePath);

  const pathToArchive = path.isAbsolute(targetDirectory)
    ? targetDirectory
    : path.resolve(currentDir, targetDirectory);

  let fileStream = createReadStream(pathToFile);
  let archiveStream = createWriteStream(pathToArchive, { flags: "wx" });
  let compress = createBrotliCompress();
  await pipeline(fileStream, compress, archiveStream);
};

const decompress = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const sourceFilePath = args[0];
  const file = path.basename(sourceFilePath);

  const targetFilepath = join(args[1], file.split(".br")[0]);

  const pathToArchive = path.isAbsolute(sourceFilePath)
    ? sourceFilePath
    : path.resolve(currentDir, sourceFilePath);

  const pathToFile = path.isAbsolute(targetFilepath)
    ? targetFilepath
    : path.resolve(currentDir, targetFilepath);

  let archiveStream = createReadStream(pathToArchive);

  let fileStream = createWriteStream(pathToFile, { flags: "wx+" });
  let decompress = createBrotliDecompress();

  await pipeline(archiveStream, decompress, fileStream);
};

export { compress, decompress };
