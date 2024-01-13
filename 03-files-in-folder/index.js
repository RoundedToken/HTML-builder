import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const folderName = 'secret-folder';
const folderPath = join(__dirname, folderName);

(async function () {
  try {
    await fs.access(folderPath);

    const objs = await fs.readdir(folderPath);

    for (const obj of objs) {
      const objPath = join(folderPath, obj);
      const stats = await fs.stat(objPath);
      const isFile = stats.isFile();
      const size = stats.size;

      if (isFile) {
        logFileInfoByTemp(obj, size);
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

function logFileInfoByTemp(file, size) {
  const [fileName, fileExt] = file.split('.');

  console.log(`${fileName} - ${fileExt} - ${size} bytes`);
}
