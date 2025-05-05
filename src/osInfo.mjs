import os from "node:os";
import { InvalidInputError } from "./utils/commandUtils.mjs";
import { logMsg } from "./utils/messageHandler.mjs";

const getHostCPUs = () => {
  const cpu = os.cpus();
  const amountOfCPU = cpu.length;
  const hostMachineCPU = cpu[0];
  cpu.forEach((item) =>
    logMsg(`Model: ${item.model}, clock rate: ${item.speed / 1000} GHz`)
  );

  logMsg(`Amount of CPUs: ${amountOfCPU + os.EOL}`);
};

const osInfo = (args) => {
  if (args.length !== 1 || !args[0]) {
    throw new InvalidInputError();
  }
  switch (args[0]) {
    case "--EOL":
      logMsg(`Default system End-Of-Line: ${JSON.stringify(os.EOL)}`);
      break;
    case "--cpus":
      getHostCPUs();
      break;
    case "--homedir":
      logMsg(`Home directory: ${os.homedir()}`);
      break;
    case "--username":
      logMsg(`System user name: ${os.userInfo().username}`);
      break;
    case "--architecture":
      logMsg(`CPU architecture: ${os.arch()}`);
      break;
    default:
      throw new Error("Invalid input");
  }
};

export { osInfo };
