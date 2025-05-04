import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stdout } from "node:process";
import os from "node:os";
import { join } from "node:path";
import { stat, mkdir, writeFile, rename, rm } from "node:fs/promises";

const cat = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const pathToFile = args[0];
  const newPath = path.isAbsolute(pathToFile)
    ? pathToFile
    : path.resolve(currentDir, pathToFile);
  const readableStream = createReadStream(newPath);
  readableStream.on("end", () => process.stdout.write(os.EOL));
  await pipeline(readableStream, stdout, { end: false });
};

const addFile = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const fileName = args[0];
  const filePath = join(currentDir, fileName);
  await writeFile(filePath, "");
};

const createFolder = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const folderName = args[0];
  const newFolder = join(currentDir, folderName);
  await mkdir(newFolder, { recursive: true });
};

const renameFile = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const oldFileNamePath = args[0];
  const newFileName = args[1];
  const oldFilePath = path.isAbsolute(oldFileNamePath)
    ? oldFileNamePath
    : path.resolve(currentDir, oldFileNamePath);

  const oldFile = await stat(oldFilePath);
  if (oldFile.isFile()) {
    const newFileNamePath = join(currentDir, newFileName);
    await rename(oldFilePath, newFileNamePath);
  } else {
    throw new InvalidInputError();
  }
};

const copyFile = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const sourceFilePath = args[0];
  const targetDirectory = args[1];
  const file = path.basename(sourceFilePath);

  const newSourceFilePath = path.isAbsolute(sourceFilePath)
    ? sourceFilePath
    : path.resolve(currentDir, sourceFilePath);

  const pathToDir = path.isAbsolute(targetDirectory)
    ? targetDirectory
    : path.resolve(currentDir, targetDirectory, file);

  const readStream = createReadStream(newSourceFilePath);
  const writeStream = createWriteStream(pathToDir);
  await pipeline(readStream, writeStream);
};

const moveFile = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const filepath = args[0];
  const absoluteFilePath = path.isAbsolute(filepath)
    ? filepath
    : path.resolve(currentDir, filepath);

  await copyFile(args, currentDir);
  await rm(absoluteFilePath);
};

const deleteFile = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const fileToDelete = args[0];
  const absoluteFileToDelete = path.isAbsolute(fileToDelete)
    ? fileToDelete
    : path.resolve(currentDir, fileToDelete);
  await rm(absoluteFileToDelete);
};

export {
  cat,
  addFile,
  createFolder,
  renameFile,
  copyFile,
  moveFile,
  deleteFile,
};
