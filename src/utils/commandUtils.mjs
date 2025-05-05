class InvalidInputError extends Error {
  constructor() {
    super("Invalid input");
  }
}

function getCommandParams(input) {
  if (!input) {
    return { command: "none", args: [] };
  }
  const regex = /"[^"]+"|[^\s]+/g;
  const args = input
    .match(regex)
    .map((e) => e.replace(/"(.*)"/, "$1"))
    .map((e) => e.trim());

  if (args.length < 1) {
    throw new InvalidInputError();
  }
  const command = args.shift();

  return {
    command,
    args,
  };
}

export { getCommandParams, InvalidInputError };
