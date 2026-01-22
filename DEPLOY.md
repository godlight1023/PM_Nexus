# 部署 PM Nexus 到 Vercel

PM Nexus 是基于 Next.js 构建的，部署到 [Vercel](https://vercel.com) 是最简单且推荐的方式。

## 准备工作

1.  **代码托管**：确保你的代码已经提交到 GitHub、GitLab 或 Bitbucket 仓库。
2.  **Vercel 账号**：如果没有，请注册一个 [Vercel 账号](https://vercel.com/signup)。

## 部署步骤

1.  **导入项目**：
    *   登录 Vercel Dashboard。
    *   点击 "Add New..." -> "Project"。
    *   连接你的 Git 账号并选择 `PM_Nexus` 仓库。

2.  **配置项目**：
    *   **Framework Preset**: Vercel 会自动识别为 `Next.js`。
    *   **Root Directory**: 保持默认 `./`。

3.  **设置环境变量 (Environment Variables)**：
    *   在 "Environment Variables" 区域，你需要填入本地 `.env.local` 中的所有变量。**这是最关键的一步，否则应用将无法连接 Notion 或 AI 服务。**
    
    请添加以下变量：

    | 变量名 | 说明 |
    | :--- | :--- |
    | `NOTION_API_KEY` | 你的 Notion Integration Secret (`ntn_...`) |
    | `NOTION_DATABASE_ID` | 你的 Notion 数据库 ID |
    | `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key (用于 AI 助手) |

4.  **开始部署**：
    *   点击 "Deploy" 按钮。
    *   Vercel 会自动执行 `npm install` 和 `npm run build`。

5.  **完成**：
    *   等待约 1-2 分钟，部署完成后，你将获得一个生产环境的 URL (例如 `pm-nexus.vercel.app`)。

## 🇨🇳 国内网络访问优化指南

由于 `vercel.app` 域名在中国大陆地区访问不稳定（经常无法连接），如果你需要国内网络流畅访问，推荐以下几种方案：

### 方案一：绑定自定义域名（推荐 👍）
这是最简单且成本最低的方法。
1.  **购买域名**：在阿里云、腾讯云或 NameSilo 等平台购买一个个人域名（例如 `yourname.com`）。
2.  **绑定 Vercel**：
    *   在 Vercel 项目设置中找到 **Domains**。
    *   输入你的域名并点击 Add。
    *   根据提示在你的域名 DNS 提供商处添加 CNAME 记录（指向 `cname.vercel-dns.com`）。
3.  **效果**：自定义域名通常可以绕过 `vercel.app` 的屏蔽，实现国内直连访问。

### 方案二：使用 Zeabur 部署（国内友好 🚀）
[Zeabur](https://zeabur.com) 是一个对国内开发者非常友好的部署平台，服务器节点通常位于香港或新加坡，访问速度快。
1.  登录 Zeabur 并连接 GitHub。
2.  导入 `PM_Nexus` 仓库。
3.  在“变量”设置中填入环境变量（同 Vercel）。
4.  Zeabur 会自动识别 Next.js 并完成部署。
5.  它提供的免费域名后缀 `zeabur.app` 目前在国内访问较稳定。

### 方案三：Docker 部署到国内服务器（最稳定 🛡️）
如果你有阿里云、腾讯云等国内云服务器，可以使用 Docker 进行私有化部署。我们已经为你准备好了 `Dockerfile`。

1.  **在服务器上安装 Docker**。
2.  **拉取代码并构建镜像**：
    ```bash
    docker build -t pm-nexus .
    ```
3.  **运行容器**（注意替换环境变量）：
    ```bash
    docker run -d -p 3000:3000 \
      -e NOTION_API_KEY="你的key" \
      -e NOTION_DATABASE_ID="你的id" \
      -e DEEPSEEK_API_KEY="你的key" \
      --name pm-nexus \
      pm-nexus
    ```
4.  **访问**：通过 `http://服务器IP:3000` 访问，或配置 Nginx 反向代理绑定域名。

---

## 常见问题

### 1. Build 失败？
*   检查 GitHub 上的代码是否最新。
*   查看 Vercel 的 Build Logs，通常是因为 TypeScript 类型错误或 ESLint 错误导致构建中断。如果遇到严格的类型检查阻碍部署，可以在 `next.config.mjs` 中暂时关闭（不推荐）：
    ```javascript
    const nextConfig = {
      typescript: { ignoreBuildErrors: true },
      eslint: { ignoreDuringBuilds: true },
    };
    ```

### 2. 页面显示 500 错误？
*   通常是环境变量未正确配置。请进入 Vercel 项目设置 -> Settings -> Environment Variables 检查是否填错，修改后需要 **Redeploy** (重新部署) 才能生效。

### 3. Notion 数据不更新？
*   我们在代码中设置了缓存 (Revalidation)。Next.js 默认会缓存静态页面。
*   本项目使用了 ISR (Incremental Static Regeneration) 或动态获取。如果需要实时性，请确保 API 路由配置了 `export const dynamic = 'force-dynamic'` (目前 AI 路由已配置)。

## 后续更新

只需将代码 Push 到 Git 仓库的 `main` 分支，Vercel 会自动触发新的部署。
