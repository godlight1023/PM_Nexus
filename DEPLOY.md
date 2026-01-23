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
