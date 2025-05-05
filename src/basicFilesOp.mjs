import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stdout } from "node:process";
import os from "node:os";
import { join } from "node:path";
import { stat, mkdir, writeFile, rename, rm } from "node:fs/promises";
import { getCorrectPath } from "./utils/common.mjs";
import { validateOneArg, validateTwoArgs } from "./utils/common.mjs";

const cat = async (args, currentDir) => {
  validateOneArg(args);
  const pathToFile = args[0];
  const correctPath = getCorrectPath(currentDir, pathToFile);
  const readableStream = createReadStream(correctPath);
  readableStream.on("end", () => process.stdout.write(os.EOL));
  await pipeline(readableStream, stdout, { end: false });
};

const addFile = async (args, currentDir) => {
  validateOneArg(args);
  const fileName = args[0];
  const filePath = join(currentDir, fileName);
  await writeFile(filePath, "", { flag: "wx" });
};

const createFolder = async (args, currentDir) => {
  validateOneArg(args);
  const folderName = args[0];
  const newFolder = join(currentDir, folderName);
  await mkdir(newFolder, { recursive: true });
};

const renameFile = async (args, currentDir) => {
  validateTwoArgs(args);
  const oldFileNamePath = args[0];
  const newFileName = args[1];
  const correctPath = getCorrectPath(currentDir, oldFileNamePath);

  const oldFile = await stat(correctPath);
  if (oldFile.isFile()) {
    const newFileNamePath = join(currentDir, newFileName);
    await rename(correctPath, newFileNamePath);
  } else {
    throw new InvalidInputError();
  }
};

const copyFile = async (args, currentDir) => {
  validateTwoArgs(args);
  const sourceFilePath = args[0];
  const targetDirectory = args[1];
  const file = path.basename(sourceFilePath);
  const correctSourcePath = getCorrectPath(currentDir, sourceFilePath);

  const pathToDir = path.isAbsolute(targetDirectory)
    ? path.resolve(targetDirectory, file)
    : path.resolve(currentDir, targetDirectory, file);

  const readStream = createReadStream(correctSourcePath);
  const writeStream = createWriteStream(pathToDir, { flags: "wx" });
  await pipeline(readStream, writeStream);
};

const moveFile = async (args, currentDir) => {
  validateTwoArgs(args);
  const filepath = args[0];
  const correctPath = getCorrectPath(currentDir, filepath);

  await copyFile(args, currentDir);
  await rm(correctPath);
};

const deleteFile = async (args, currentDir) => {
  validateOneArg(args);
  const fileToDelete = args[0];
  const correctPath = getCorrectPath(currentDir, fileToDelete);
  await rm(correctPath);
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
