# 手动安装Git指南

## 安装步骤

### 第一步：下载Git安装包
1. 打开浏览器，访问 https://git-scm.com/download/win
2. 点击 "Click here to download" 链接
3. 根据您的系统架构选择版本：
   - 64位系统：下载以 "64-bit" 结尾的安装包
   - 32位系统：下载以 "32-bit" 结尾的安装包

### 第二步：安装Git
1. 双击下载的安装包（例如：Git-2.45.2-64-bit.exe）
2. 在安装向导中：
   - 选择安装路径（建议使用默认路径）
   - 组件选择：保持默认选项
   - 默认编辑器：选择 "Use Visual Studio Code as Git's default editor" 或保持默认
   - 调整PATH环境变量：选择 "Git from the command line and also from 3rd-party software"
   - HTTPS传输后端：保持默认 "Use the OpenSSL library"
   - 行结束符转换：选择 "Checkout Windows-style, commit Unix-style line endings"
   - 终端仿真器：选择 "Use Windows' default console window"
   - 其他选项：保持默认设置

3. 点击 "Install" 开始安装
4. 安装完成后，点击 "Finish"

### 第三步：验证安装
1. 重新启动命令行工具（PowerShell或命令提示符）
2. 运行以下命令验证安装：
   ```bash
   git --version
   ```
   如果显示类似 "git version 2.45.2.windows.1" 的信息，说明安装成功

### 第四步：配置Git用户信息
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 第五步：初始化GitHub仓库
1. 进入项目目录：
   ```bash
   cd c:\Users\Administrator\jucaizhongfa
   ```

2. 添加远程仓库：
   ```bash
   git remote add origin https://github.com/jinyang756/Debox-NFT-Sim.git
   ```

3. 验证远程仓库配置：
   ```bash
   git remote -v
   ```

4. 推送代码到GitHub：
   ```bash
   git push -u origin main
   ```

## 常见问题解决

### 1. Git命令未找到
- 确保已重新启动命令行工具
- 检查PATH环境变量是否包含Git安装路径
- 重新安装Git并确保选择了正确的PATH配置选项

### 2. 权限被拒绝
- 确保您有权限访问GitHub仓库
- 检查仓库URL是否正确
- 考虑使用SSH密钥认证

### 3. 网络连接问题
- 检查网络连接
- 如果在公司网络环境下，可能需要配置代理

## 安装后验证

运行以下命令验证Git是否正常工作：

```bash
# 检查Git版本
git --version

# 检查用户配置
git config --global user.name
git config --global user.email

# 检查远程仓库
cd c:\Users\Administrator\jucaizhongfa
git remote -v

# 检查仓库状态
git status
```

## 下一步操作

安装并配置Git后，您可以：

1. 运行 `init-git.bat` 脚本初始化仓库
2. 或直接运行 `node scripts/init-git-repo.js` 脚本
3. 开始推送代码到GitHub仓库

---
*指南创建时间: 2025年10月20日*