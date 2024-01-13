import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const stylesName = 'styles';
const distName = 'project-dist';
const bundleName = 'style.css';
const indexHtmlName = 'index.html';
const assetsName = 'assets';
const templateName = 'template.html';
const componentsName = 'components';
const stylesPath = join(__dirname, stylesName);
const distPath = join(__dirname, distName);
const bundlePath = join(distPath, bundleName);
const indexHtmlPath = join(distPath, indexHtmlName);
const assetsPath = join(__dirname, assetsName);
const assetsCopyPath = join(distPath, assetsName);
const templatePath = join(__dirname, templateName);
const componentsPath = join(__dirname, componentsName);

(async function () {
  try {
    await fs.access(stylesPath);

    await createDist(distPath);

    await createBundle(bundlePath);

    await fs.mkdir(assetsCopyPath);
    await copy(assetsPath, assetsCopyPath);

    await createIndexHtml();
  } catch (error) {
    console.error(error);
  }
})();

async function copy(src, dest) {
  const stat = await fs.stat(src);

  if (stat.isFile()) {
    const content = await fs.readFile(src);

    await fs.writeFile(dest, content);
  } else if (stat.isDirectory()) {
    const files = await fs.readdir(src);

    await fs.mkdir(dest, { recursive: true });

    for (let file of files) {
      const srcPath = join(src, file);
      const destPath = join(dest, file);

      await copy(srcPath, destPath);
    }
  }
}

async function createIndexHtml() {
  try {
    await fs.access(templatePath);
    await fs.access(componentsPath);

    const components = await fs.readdir(componentsPath);
    let template = await fs.readFile(templatePath, { encoding: 'utf-8' });

    for (const component of components) {
      const [componentExt, ...componentPrefixes] = component
        .split('.')
        .reverse();
      const componentName = componentPrefixes.join('.');
      const componentPath = join(componentsPath, component);
      const componentContent = await fs.readFile(componentPath, {
        encoding: 'utf-8',
      });
      const isHtml = componentExt === 'html';

      if (isHtml) {
        template = template.replace(`{{${componentName}}}`, componentContent);
      }
    }

    await fs.writeFile(indexHtmlPath, template, { encoding: 'utf-8' });
  } catch (error) {
    console.error(error);
  }
}

async function createBundle(path) {
  try {
    const objs = await fs.readdir(stylesPath);

    await fs.writeFile(path, '', { encoding: 'utf-8' });

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
}

async function createDist(path) {
  try {
    await fs.access(path);
    await fs.rm(path, { recursive: true, force: true });
  } catch (error) {}

  await fs.mkdir(path);
}
