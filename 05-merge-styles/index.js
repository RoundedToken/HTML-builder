import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesName = 'styles';
const distName = 'project-dist';
const bundleName = 'bundle.css';
const stylesPath = join(__dirname, stylesName);
const distPath = join(__dirname, distName);
const bundlePath = join(distPath, bundleName);

(async function () {
  try {
    await fs.access(stylesPath);
    await fs.access(distPath);

    await createBundle(bundlePath);

    const objs = await fs.readdir(stylesPath);

    for (const obj of objs) {
      const objPath = join(stylesPath, obj);
      const stats = await fs.stat(objPath);
      const isFile = stats.isFile();
      const objExt = obj.split('.').at(-1);
      const isCssExt = objExt === 'css';

      if (isFile && isCssExt) {
        const content = await fs.readFile(objPath, { encoding: 'utf8' });

        await fs.appendFile(bundlePath, content, {
          encoding: 'utf8',
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

async function createBundle(path) {
  try {
    await fs.access(path);
    await fs.rm(path);
  } catch (error) {}

  await fs.writeFile(path, '', { encoding: 'utf-8' });
}
