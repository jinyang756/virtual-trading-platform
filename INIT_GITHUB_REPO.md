# GitHub仓库初始化指南

## 概述
本指南将帮助您将本地项目与GitHub远程仓库进行关联和同步。

## 远程仓库信息
- **仓库地址**: https://github.com/jinyang756/Debox-NFT-Sim.git
- **默认分支**: main

## 初始化步骤

### 1. 安装Git（如果尚未安装）
如果您尚未安装Git，请按照以下步骤操作：

#### Windows系统安装Git:
1. 访问Git官网下载页面: https://git-scm.com/download/win
2. 下载适合您系统的Git安装包
3. 运行安装程序，按照默认设置进行安装
4. 安装完成后，重启您的命令行工具

#### 验证安装:
```bash
git --version
```

### 2. 配置Git用户信息
安装Git后，需要配置您的用户信息：

```bash
# 进入项目目录
cd c:\Users\Administrator\jucaizhongfa

# 配置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. 关联远程仓库
项目已经初始化了Git仓库，现在需要关联远程仓库：

```bash
# 添加远程仓库
git remote add origin https://github.com/jinyang756/Debox-NFT-Sim.git

# 验证远程仓库是否添加成功
git remote -v
```

### 4. 推送代码到GitHub
```bash
# 确保您在main分支上
git checkout main

# 推送所有代码到远程仓库
git push -u origin main
```

### 5. 后续操作
推送完成后，您可以正常使用Git进行版本控制：

```bash
# 添加所有更改
git add .

# 提交更改
git commit -m "您的提交信息"

# 推送到远程仓库
git push
```

## 常见问题解决

### 如果遇到分支名称问题:
```bash
# 重命名当前分支为main
git branch -M main
```

### 如果远程仓库已有内容需要合并:
```bash
# 拉取远程仓库内容
git pull origin main --allow-unrelated-histories
```

### 如果需要强制推送（谨慎使用）:
```bash
# 强制推送（会覆盖远程仓库内容）
git push -u origin main --force
```

## 项目文件结构
项目包含以下重要文件和目录：
- `src/` - 源代码目录
- `tests/` - 测试文件
- `docs/` - 文档文件
- `scripts/` - 脚本文件
- `Dockerfile` - Docker配置文件
- `docker-compose.yml` - Docker Compose配置文件
- `k8s/` - Kubernetes配置文件
- `README.md` - 项目说明文件
- `package.json` - Node.js依赖配置

## 注意事项
1. 请确保您的GitHub账户有权限访问 https://github.com/jinyang756/Debox-NFT-Sim.git
2. 如果仓库不存在，您可能需要先在GitHub上创建它
3. 建议定期备份重要代码
4. 在推送敏感信息前，请检查.gitignore文件是否正确配置

---
*初始化完成时间: 2025年10月20日*