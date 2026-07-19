# YourColors

使用 [GameCreator](https://www.gamecreator.com.cn) 制作的视觉小说 / 游戏项目。

## 在线预览

仓库开启 GitHub Pages 后，可直接访问 `index.html` 在浏览器中运行（游戏主体为 HTML5，部分 NW.js 专属功能可能受限）。

## 本地运行

### 方式一：NW.js 桌面版
1. 下载 [NW.js](https://nwjs.io/) 对应版本
2. 将本项目文件放入 NW.js 应用目录
3. 运行 `nw.exe` 或本目录下的桌面入口

### 方式二：浏览器
直接在浏览器中打开 `index.html`。

## 项目结构

- `index.html` — 入口页面
- `script.js` — 游戏主逻辑（由 GameCreator 生成）
- `package.json` — NW.js 应用配置
- `asset/` — 游戏资源（图片、音频、JSON 数据等）
- `icon.png` — 应用图标
