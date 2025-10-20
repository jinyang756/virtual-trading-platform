# Git使用指南

## 当前项目状态

项目已成功配置Git并创建了多个有用的工具脚本。以下是当前状态：

- ✅ Git已安装并配置
- ✅ 用户信息已设置
- ✅ 远程仓库已关联
- ✅ 创建了多个辅助脚本

## 已创建的工具脚本

### 1. Git别名脚本
- `git.bat` - 简化Git命令调用

### 2. 安装和初始化脚本
- `install-git.bat` - 自动下载并安装Git
- `install-git.ps1` - PowerShell版本的安装脚本
- `install-git-simple.ps1` - 简化版PowerShell脚本
- `install-git-en.ps1` - 英文版PowerShell脚本
- `download-git.bat` - 下载Git安装包
- `download-git-simple.bat` - 简化版下载脚本

### 3. 配置和验证脚本
- `setup-git-alias.bat` - 设置常用Git别名
- `test-git-installation.bat` - 验证Git安装状态
- `check-git-push-en.bat` - 检查推送状态（英文版）
- `check-git-push.bat` - 检查推送状态（中文版）
- `complete-git-setup.bat` - 完成Git设置

### 4. 初始化脚本
- `init-git.bat` - 初始化GitHub仓库
- `scripts/init-git-repo.js` - Node.js版本的初始化脚本

## 常用Git操作

### 1. 查看状态
```bash
# 使用别名
git.bat st

# 或使用完整路径
"C:\Program Files\Git\bin\git.exe" status
```

### 2. 添加文件
```bash
# 添加所有更改
git.bat add .

# 添加特定文件
git.bat add <文件名>
```

### 3. 提交更改
```bash
git.bat commit -m "提交信息"
```

### 4. 推送到GitHub
```bash
git.bat push origin main
```

### 5. 拉取远程更改
```bash
git.bat pull origin main
```

## Git别名

已配置以下别名以简化操作：
- `git st` = `git status`
- `git co` = `git checkout`
- `git br` = `git branch`
- `git ci` = `git commit`
- `git ps` = `git push`
- `git pl` = `git pull`

## 推送到GitHub的步骤

1. **首次推送**：
   ```bash
   "C:\Program Files\Git\bin\git.exe" push origin main
   ```
   系统会提示输入GitHub用户名和密码

2. **后续推送**：
   由于已配置凭证存储，后续推送将自动使用存储的凭证

## 故障排除

### 1. 如果推送失败
- 检查网络连接
- 确认GitHub用户名和密码正确
- 尝试使用个人访问令牌代替密码

### 2. 如果Git命令未找到
- 使用完整路径调用Git：
  ```bash
  "C:\Program Files\Git\bin\git.exe" <命令>
  ```

### 3. 如果需要重新配置远程仓库
```bash
git.bat remote set-url origin https://github.com/jinyang756/Debox-NFT-Sim.git
```

## 项目文件结构

```
.git/                           # Git仓库目录
.gitignore                      # Git忽略文件配置
git.bat                         # Git别名脚本
install-git.bat                 # Git安装脚本
install-git.ps1                 # PowerShell安装脚本
init-git.bat                    # 初始化脚本
scripts/init-git-repo.js        # Node.js初始化脚本
setup-git-alias.bat             # 别名设置脚本
test-git-installation.bat       # 安装验证脚本
...
```

## 后续维护建议

1. **定期提交**：建议每天工作结束后提交代码
2. **有意义的提交信息**：使用清晰、简洁的提交信息
3. **分支管理**：为新功能创建独立分支进行开发
4. **定期推送**：定期将代码推送到远程仓库进行备份

---
*指南创建时间: 2025年10月20日*