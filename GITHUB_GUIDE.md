# 如何将 PM Nexus 提交到 GitHub

检测到你的环境中可能尚未安装 Git，或者 Git 未配置到系统路径中。请按照以下步骤操作。

## 第一步：安装 Git (如已安装可跳过)

1.  **下载**：访问 [git-scm.com](https://git-scm.com/downloads) 下载 Windows 版本。
2.  **安装**：运行安装包，一路点击 "Next" 即可。
    *   **关于安装目录**：通常使用默认路径 (`C:\Program Files\Git`) 即可。
    *   **注意**：尽量避免安装在包含**中文**、**空格**（虽然默认路径有空格通常没问题，但自定义路径最好避免）或**特殊字符**的路径下，以免出现极少数工具的兼容性问题。
3.  **验证**：安装完成后，重新打开终端（或重启 VS Code），输入 `git --version`，如果显示版本号说明安装成功。

## 第二步：初始化本地仓库

在 VS Code 的终端中（快捷键 `Ctrl + ~`）依次运行以下命令：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件到暂存区 (注意有个点)
git add .

# 3. 提交代码到本地
git commit -m "Initial commit: PM Nexus project setup"
```

## 第三步：在 GitHub 创建仓库

1.  登录 [GitHub](https://github.com)。
2.  点击右上角的 **+** 号 -> **New repository**。
3.  **Repository name**: 输入 `PM_Nexus` (或你喜欢的名字)。
4.  **Privacy**: 选择 Public (公开) 或 Private (私有)。
5.  **不要**勾选 "Initialize this repository with a README" (因为我们本地已经有了)。
6.  点击 **Create repository**。

## 第四步：推送代码到 GitHub

在 GitHub 创建好仓库后，你会看到类似下面的提示。请复制 "…or push an existing repository from the command line" 下方的命令，在你的 VS Code 终端中运行：

```bash
# 1. 将本地仓库关联到远程 GitHub 仓库 (将 <你的用户名> 替换为实际用户名)
git remote add origin https://github.com/<你的用户名>/PM_Nexus.git

# 2. 将代码推送到 main 分支
git branch -M main
git push -u origin main
```

## 常见问题

*   **登录验证**：第一次 `git push` 时，会弹出窗口让你登录 GitHub 账号，按照提示授权即可。
*   **邮箱配置**：如果报错提示 "Please tell me who you are"，请运行：
    ```bash
    git config --global user.email "你的邮箱@example.com"
    git config --global user.name "你的名字"
    ```
