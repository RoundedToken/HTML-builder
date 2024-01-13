import { ReadStream, promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fileName = 'text.txt';
const filePath = join(__dirname, fileName);

(async function () {
  try {
    await fs.access(filePath);

    let text = '';

    const stream = ReadStream(filePath, { encoding: 'utf8' });

    stream.on('data', (chunk) => (text += chunk));

    stream.on('end', () => console.log(text));

    stream.on('error', (err) => {
      throw new Error(err);
    });
  } catch (error) {
    console.error(error);
  }
})();
