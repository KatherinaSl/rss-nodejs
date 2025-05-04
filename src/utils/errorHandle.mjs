// const USE_COLORS = true;
// const supportsColor =
//   process.stdout.isTTY && process.env.TERM !== "dumb" && USE_COLORS;

const colors = {
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
};

const colorMap = {
  info: colors.green,
  important: colors.yellow,
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
