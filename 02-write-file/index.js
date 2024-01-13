import { createWriteStream } from 'fs';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fileName = 'text.txt';
const filePath = join(__dirname, fileName);

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Добро пожаловать! Введите текст и нажмите Enter:');

const fileStream = createWriteStream(filePath, { flags: 'w' });

rl.on('line', (input) => {
  if (input === 'exit') {
    process.exit();
  }

  fileStream.write(`${input}\n`);

  console.log('Введите текст и нажмите Enter:');
});

process.on('exit', () => {
  fileStream.end();
  rl.close();
  console.log('До свидания!');
});
