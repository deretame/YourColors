const fs = require('fs');
const path = require('path');

const inputDir = 'asset_decrypted/json/server/scene';
const outputFile = 'asset_decrypted/剧情文本.txt';

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function extractDialogue(sceneData) {
  const lines = [];
  const commands = sceneData.customCommands?.[0] || [];
  for (const cmd of commands) {
    if (cmd[0] === 11) {
      const speaker = cmd[3] || '';
      const text = stripHtml(cmd[6]);
      if (text) {
        lines.push({ speaker, text });
      }
    }
  }
  return lines;
}

let output = '';

for (let i = 1; i <= 7; i++) {
  const filePath = path.join(inputDir, `s${i}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn('File not found:', filePath);
    continue;
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const dialogues = extractDialogue(data);

  output += `\n=== 场景 s${i} ===\n\n`;
  for (const { speaker, text } of dialogues) {
    if (speaker) {
      output += `【${speaker}】${text}\n\n`;
    } else {
      output += `${text}\n\n`;
    }
  }

  console.log(`场景 s${i}: ${dialogues.length} 句对话`);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, output.trim(), 'utf8');
console.log(`已保存到: ${outputFile}`);
