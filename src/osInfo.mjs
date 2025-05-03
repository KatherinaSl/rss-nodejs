import os from "node:os";

const getEndOfLine = () => {
  console.log(os.EOL);
};

const getHostCPUs = () => {
  const cpu = os.cpus();
  const amountOfCPU = cpu.length;
  cpu.forEach((item) =>
    console.log(`Model: ${item.model}, clock rate: ${item.speed / 1000} GHz`)
  );
  console.log(`Amount of CPUS: ${amountOfCPU}`);
};

// const getHomeDir = () => {
//   console.log(`Home directory ${os.homedir()}`);
// };

const osInfo = (param) => {
  switch (param) {
    case "--EOL":
      getEndOfLine();
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
  }
};

export { osInfo };
