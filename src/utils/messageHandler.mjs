const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  white: "\x1b[37m",
  reset: "\x1b[0m",
};

const colorMap = {
  info: colors.green,
  important: colors.yellow,
  normal: colors.white,
  error: colors.red,
};

function logMsg(msg, type = "info") {
  const message = `${colorMap[type]}${msg}${colors.reset}`;
  console.log(message);
}

function logErrorMsg(msg) {
  const message = `${colorMap.error}${msg}${colors.reset}`;
  console.log(message);
}

export { logErrorMsg, logMsg };
