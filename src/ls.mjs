import { readdir } from "node:fs/promises";

// const __dirname = dirname(fileURLToPath(import.meta.url));

// UV_DIRENT_UNKNOWN,
// UV_DIRENT_FILE,
// UV_DIRENT_DIR,
// UV_DIRENT_LINK,
// UV_DIRENT_FIFO,
// UV_DIRENT_SOCKET,
// UV_DIRENT_CHAR,
// UV_DIRENT_BLOCK,

const ls = async (currentDir) => {
  const files = await readdir(currentDir, { withFileTypes: true });
  const columns = files.map((file) => ({
    Name: file.name,
    Type: file.isDirectory() && !file.isSymbolicLink() ? "directory" : "file",
    //TODO correct separation ders\files\links\etc
  }));
  console.table(
    columns.sort(
      (a, b) => a.Type.localeCompare(b.Type) || a.Name.localeCompare(b.Name)
    )
  );
};

export default ls;
