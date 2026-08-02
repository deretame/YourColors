# YourColors

使用 [GameCreator](https://www.gamecreator.com.cn) 制作的视觉小说 / 游戏项目。

## 版权声明

本项目仅供个人学习交流使用，版权归原作者及官方所有。

- 下载本仓库内容后，请在 **24 小时内删除**。
- 请勿用于商业用途或二次传播。
- 如果你喜欢这款游戏，请支持正版，前往官方 Steam 商店页面下载：

**👉 [https://store.steampowered.com/app/4831190/_/](https://store.steampowered.com/app/4831190/_/)**

## 在线预览

仓库已开启 GitHub Pages，可直接访问：

**[https://deretame.github.io/YourColors/](https://deretame.github.io/YourColors/)**

游戏主体为 HTML5，部分 NW.js 专属功能可能在浏览器中受限。

## 本地运行

### 方式一：NW.js 桌面版
1. 下载 [NW.js](https://nwjs.io/) 对应版本
2. 将本项目文件放入 NW.js 应用目录
3. 运行 `nw.exe` 或本目录下的桌面入口

### 方式二：浏览器
直接在浏览器中打开 `index.html`。

## 资源解密

仓库中的 `asset/` 目录保存了游戏加密后的资源（图片、JSON 数据等）。项目中已提供了几个解密脚本，使用步骤如下：

1. 安装依赖：
   ```bash
   npm install
   ```

2. 解密图片（`asset/image` → `asset_decrypted/image`）：
   ```bash
   node decrypt_images.js
   ```
   图片采用 GameCreator 资源加密：交换文件第 2、3 字节并删除中间位置字节，详见 `decrypt_images.js` 中的 `decryptAsset` 函数。

3. 解密 JSON 数据（`asset/json` → `asset_decrypted/json`）：
   ```bash
   node decrypt_json.js
   ```
   JSON 文件本质是以 `gc_zip` / `gc_zip_2024` 为密码的 zip 压缩包，由 `decrypt_json.js` 负责解压。

4. 提取剧情文本（输出到 `asset_decrypted/剧情文本.txt`）：
   ```bash
   node extract_dialogue.js
   ```
   `extract_dialogue.js` 会读取解密后的场景 JSON，并解析其中的对话命令。

对应文件：
- `decrypt_images.js` — 图片解密
- `decrypt_json.js` — JSON 数据解密
- `extract_dialogue.js` — 剧情文本提取

解密脚本的输出目录为 `asset_decrypted/`，该目录不参与版本控制。

## 项目结构

- `index.html` — 入口页面
- `script.js` — 游戏主逻辑（由 GameCreator 生成）
- `package.json` — NW.js 应用配置
- `asset/` — 游戏资源（图片、音频、JSON 数据等）
- `icon.png` — 应用图标
