import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stdout } from "node:process";
import os from "node:os";
import logErrorMsg from "./utils/errorHandle.mjs";
import { join } from "node:path";
import { stat, mkdir, writeFile, rename, rm } from "node:fs/promises";

const cat = async (input, currentDir) => {
  try {
    //todo check absolute path
    const pathToFile = input.slice(4).trim();
    const newPath = path.resolve(currentDir, pathToFile);
    const readableStream = createReadStream(newPath);
    readableStream.on("end", () => process.stdout.write(os.EOL));
    await pipeline(readableStream, stdout, { end: false });
  } catch {
    logErrorMsg("Invalid input, such file doesn't exist", "error");
  }
};

const addFile = async (input, currentDir) => {
  const fileName = input.slice(4).trim();
  const filePath = join(currentDir, fileName);
  await writeFile(filePath, "");
};

const createFolder = async (input, currentDir) => {
  const folderName = input.slice(6).trim();
  const newFolder = join(currentDir, folderName);
  await mkdir(newFolder, { recursive: true });
};


//todo absolute paths
const renameFile = async (input, currentDir) => {
  const oldFileName = input.split(" ")[1];
  const newFileName = input.split(" ")[2];
  const oldFilePath = join(currentDir, oldFileName);

  try {
    const oldFile = await stat(oldFilePath);
    if (oldFile.isFile()) {
      const newFileNamePath = join(currentDir, newFileName);
      await rename(oldFilePath, newFileNamePath);
    }
  } catch {
    logErrorMsg("Operation failed", "error");
  }
};

const copyFile = async (input, currentDir) => {
  const sourceFilePath = input.split(" ")[1];
  const targetDirectory = input.split(" ")[2];
  const file = path.basename(sourceFilePath);
  //   const pathToDir = join(currentDir, targetDirectory, file);

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

const moveFile = async (input, currentDir) => {
  const sourceFilePath = input.split(" ")[1];
  const newSourceFilePath = path.isAbsolute(sourceFilePath)
    ? sourceFilePath
    : path.resolve(currentDir, sourceFilePath);

  await copyFile(input, currentDir);
  await rm(newSourceFilePath);
};

const deleteFile = async (input, currentDir) => {
  const fileToDelete = input.slice(3).trim();
  const newFileToDelete = path.isAbsolute(fileToDelete)
    ? fileToDelete
    : path.resolve(currentDir, fileToDelete);
  await rm(newFileToDelete);
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
