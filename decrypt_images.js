const fs = require('fs');
const path = require('path');

const sourceDir = 'asset/image';
const outputDir = 'asset_decrypted/image';

const imageExts = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return imageExts.includes(ext);
}

// GameCreator 资源解密算法：
// 1. 交换第 2、3 字节，还原文件头
// 2. 计算中点位置 floor((len - 1) * 0.5)
// 3. 移除该位置的字节，拼接前后两部分
function decryptAsset(data) {
  const buf = Buffer.from(data);
  if (buf.length >= 3) {
    [buf[1], buf[2]] = [buf[2], buf[1]];
  }
  const randomPos = Math.floor((buf.length - 1) * 0.5);
  const firstPart = buf.slice(0, randomPos);
  const secondPart = buf.slice(randomPos + 1);
  return Buffer.concat([firstPart, secondPart]);
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

// 清空旧输出目录
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

let count = 0;
walk(sourceDir, (filePath) => {
  if (!isImage(filePath)) return;
  const relativePath = path.relative(sourceDir, filePath);
  const outputPath = path.join(outputDir, relativePath);
  const decrypted = decryptAsset(fs.readFileSync(filePath));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, decrypted);
  count++;
});

console.log(`解密完成：${count} 张图片`);
console.log(`输出目录：${outputDir}`);
