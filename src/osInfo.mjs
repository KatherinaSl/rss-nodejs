import os from "node:os";
import { InvalidInputError } from "./utils/commandUtils.mjs";

const getHostCPUs = () => {
  const cpu = os.cpus();
  const amountOfCPU = cpu.length;
  cpu.forEach((item) =>
    console.log(`Model: ${item.model}, clock rate: ${item.speed / 1000} GHz`)
  );
  console.log(`Amount of CPUS: ${amountOfCPU}`);
};

const osInfo = (args) => {
  if (args.length !== 1 || !args[0]) {
    // throw new Error("Invalid input");
    throw new InvalidInputError();
  }
  switch (args[0]) {
    case "--EOL":
      console.log(`Default system End-Of-Line ${JSON.stringify(os.EOL)}`);
      break;
    case "--cpus":
      getHostCPUs();
      break;
    case "--homedir":
      console.log(`Home directory ${os.homedir()}`);
      break;
    case "--username":
      console.log(`System user name ${os.userInfo().username}`);
      break;
    case "--architecture":
      console.log(`CPU architecture ${os.arch()}`);
      break;
    default:
      throw new Error("Invalid input");
  }
};

export { osInfo };
