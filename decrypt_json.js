const fs = require('fs');
const path = require('path');
const { ZipReader, BlobReader, TextWriter } = require('@zip.js/zip.js');

const sourceDir = 'asset/json';
const outputDir = 'asset_decrypted/json';
const password = 'gc_zip';

async function decryptJsonFile(inputPath, outputPath) {
  const data = fs.readFileSync(inputPath);
  const blob = new Blob([data]);
  let lastError;
  for (const password of ['gc_zip', 'gc_zip_2024']) {
    try {
      const reader = new ZipReader(new BlobReader(blob), { password });
      const entries = await reader.getEntries();
      if (entries.length === 0) {
        await reader.close();
        continue;
      }
      const entry = entries[0];
      const text = await entry.getData(new TextWriter());
      await reader.close();
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, text, 'utf8');
      return password;
    } catch (e) {
      lastError = e;
    }
  }
  throw new Error(`Failed to decrypt ${inputPath}: ${lastError.message}`);
}

function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else if (entry.isFile()) {
      callback(fullPath);
    }
  }
}

(async () => {
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  let count = 0;
  const failures = [];
  const files = [];
  walk(sourceDir, (filePath) => {
    if (path.extname(filePath).toLowerCase() === '.json') {
      files.push(filePath);
    }
  });

  for (const filePath of files) {
    const relativePath = path.relative(sourceDir, filePath);
    const outputPath = path.join(outputDir, relativePath);
    try {
      const usedPassword = await decryptJsonFile(filePath, outputPath);
      count++;
      if (usedPassword !== 'gc_zip') {
        console.log('Used', usedPassword, 'for', relativePath);
      }
    } catch (e) {
      failures.push(relativePath + ': ' + e.message);
    }
  }

  console.log(`解密完成：${count} 个 JSON 文件`);
  if (failures.length > 0) {
    console.log(`失败：${failures.length} 个`);
    failures.forEach(f => console.log(' -', f));
  }
  console.log(`输出目录：${outputDir}`);
})();
