import { readdir } from "node:fs/promises";

const ls = async (currentDir) => {
  const files = await readdir(currentDir, { withFileTypes: true });
  const columns = files.map((file) => ({
    Name: file.name,
    Type: checkType(file),
  }));
  console.table(
    columns.sort(
      (a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)
    )
  );
};

const checkType = (file) => {
  if (file.isDirectory()) return "directory";
  if (file.isSymbolicLink()) return "link";
  if (file.isFile()) return "file";
  return "other";
};

export default ls;
