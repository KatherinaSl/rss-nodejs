import os from "node:os";
import path from "node:path";

const getUserName = () => {
  let username = "";
  if (process.argv.length > 2) {
    const processArgv = process.argv.slice(2);
    username = processArgv[0].split("=")[1];
  } else {
    username = os.userInfo().username;
  }

  return username;
};

const getCorrectPath = (currentDir, pathToFile) => {
  return path.isAbsolute(pathToFile)
    ? pathToFile
    : path.resolve(currentDir, pathToFile);
};

export { getUserName, getCorrectPath };
