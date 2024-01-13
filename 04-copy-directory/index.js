import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const folderName = 'files';
const folderCopyName = 'files-copy';
const folderPath = join(__dirname, folderName);
const folderCopyPath = join(__dirname, folderCopyName);

(async function () {
  try {
    await fs.access(folderPath);

    await makeNewDir(folderCopyPath);

    const objs = await fs.readdir(folderPath);

    for (const obj of objs) {
      const objPath = join(folderPath, obj);
      const copiedObjPath = join(folderCopyPath, obj);
      const stats = await fs.stat(objPath);
      const isFile = stats.isFile();

      if (isFile) {
        fs.copyFile(objPath, copiedObjPath);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

async function makeNewDir(path) {
  try {
    await fs.access(path);
    await fs.rm(path, { recursive: true });
  } catch (e) {}

  await fs.mkdir(path);
}
