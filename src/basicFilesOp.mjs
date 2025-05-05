import path from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { stdout } from "node:process";
import os from "node:os";
import { join } from "node:path";
import { stat, mkdir, writeFile, rename, rm } from "node:fs/promises";
import { getCorrectPath } from "./utils/common.mjs";

const cat = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const pathToFile = args[0];
  const correctPath = getCorrectPath(currentDir, pathToFile);
  // const newPath = path.isAbsolute(pathToFile)
  //   ? pathToFile
  //   : path.resolve(currentDir, pathToFile);
  const readableStream = createReadStream(correctPath);
  readableStream.on("end", () => process.stdout.write(os.EOL));
  await pipeline(readableStream, stdout, { end: false });
};

const addFile = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const fileName = args[0];
  const filePath = join(currentDir, fileName);
  await writeFile(filePath, "", { flag: "wx" });
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
  const correctPath = getCorrectPath(currentDir, oldFileNamePath);

  // const oldFilePath = path.isAbsolute(oldFileNamePath)
  //   ? oldFileNamePath
  //   : path.resolve(currentDir, oldFileNamePath);

  const oldFile = await stat(correctPath);
  if (oldFile.isFile()) {
    const newFileNamePath = join(currentDir, newFileName);
    await rename(correctPath, newFileNamePath);
  } else {
    throw new InvalidInputError();
  }
};

// я вот в cp сначала проверяю srcPath через fs.access

// в некоторых коммандах проверяю на существование, например cp создаёт destination в любом случае, даже если сорса нет
// хотя я только подумал что наверное было бы удобнее чекать sourceStream == null
// в других функциях - обработчик комманд обрабатывает ошибки
const copyFile = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const sourceFilePath = args[0];
  const targetDirectory = args[1];
  const file = path.basename(sourceFilePath);
  const correctSourcePath = getCorrectPath(currentDir, sourceFilePath);

  // const newSourceFilePath = path.isAbsolute(sourceFilePath)
  //   ? sourceFilePath
  //   : path.resolve(currentDir, sourceFilePath);

  const pathToDir = path.isAbsolute(targetDirectory)
    ? path.resolve(targetDirectory, file)
    : path.resolve(currentDir, targetDirectory, file);

  const readStream = createReadStream(correctSourcePath);
  const writeStream = createWriteStream(pathToDir, { flags: "wx" });
  await pipeline(readStream, writeStream);
};

const moveFile = async (args, currentDir) => {
  if (args.length !== 2 || !args[0] || !args[1]) {
    throw new InvalidInputError();
  }
  const filepath = args[0];
  const correctPath = getCorrectPath(currentDir, filepath);
  // const absoluteFilePath = path.isAbsolute(filepath)
  //   ? filepath
  //   : path.resolve(currentDir, filepath);

  await copyFile(args, currentDir);
  await rm(correctPath);
};

const deleteFile = async (args, currentDir) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  const fileToDelete = args[0];
  const correctPath = getCorrectPath(currentDir, fileToDelete);
  // const absoluteFileToDelete = path.isAbsolute(fileToDelete)
  //   ? fileToDelete
  //   : path.resolve(currentDir, fileToDelete);
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
