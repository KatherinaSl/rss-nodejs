function getCommandParams(input) {
  if (!input) {
    return { command: "none", args: [] };
  }
  const regex = /"[^"]+"|[^\s]+/g;
  // const regex = /["'][^"']+["']|[^\s]+/g;
  const args = input
    .match(regex)
    .map((e) => e.replace(/"(.*)"/, "$1"))
    .map((e) => e.trim());

  if (args.length < 1) {
    throw new Error("Invalid input");
  }
  const command = args.shift();

  return {
    command,
    args,
  };
}

class InvalidInputError extends Error {
  constructor() {
    super("Invalid input");
  }
}

export { getCommandParams, InvalidInputError };
