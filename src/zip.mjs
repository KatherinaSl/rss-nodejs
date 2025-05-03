import { createReadStream, createWriteStream } from "node:fs";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";
import path, { join } from "node:path";
import { pipeline } from "node:stream/promises";

const compress = async (input, currentDir) => {
  const sourceFilePath = input.split(" ")[1];
  const file = path.basename(sourceFilePath);

  const targetDirectory = join(input.split(" ")[2], `${file}.br`);
  //   const pathToDir = join(currentDir, targetDirectory, file);

  const pathToFile = path.isAbsolute(sourceFilePath)
    ? sourceFilePath
    : path.resolve(currentDir, sourceFilePath);

  const pathToArchive = path.isAbsolute(targetDirectory)
    ? targetDirectory
    : path.resolve(currentDir, targetDirectory);

  let fileStream = createReadStream(pathToFile);
  let archiveStream = createWriteStream(pathToArchive, { flags: "wx" });
  console.log(`path to file ${pathToFile}`);

  console.log(`path to archive ${pathToArchive}`);
  let compress = createBrotliCompress();
  await pipeline(fileStream, compress, archiveStream);
};

const decompress = async (input, currentDir) => {
  const sourceFilePath = input.split(" ")[1];
  const file = path.basename(sourceFilePath);

  const targetFilepath = join(input.split(" ")[2], file.split(".br")[0]);

  const pathToArchive = path.isAbsolute(sourceFilePath)
    ? sourceFilePath
    : path.resolve(currentDir, sourceFilePath);

  const pathToFile = path.isAbsolute(targetFilepath)
    ? targetFilepath
    : path.resolve(currentDir, targetFilepath);

  console.log(`pathToFile ${pathToFile}`);

  let archiveStream = createReadStream(pathToArchive);

  console.log(`pathToArchive ${pathToArchive}`);
  let fileStream = createWriteStream(pathToFile, { flags: "wx+" });
  console.log("ne upal");
  let decompress = createBrotliDecompress();

  await pipeline(archiveStream, decompress, fileStream);
};

export { compress, decompress };
