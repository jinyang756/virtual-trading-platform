const fs = require('fs');
const path = require('path');

// 确保scripts目录存在
const scriptsDir = path.join(__dirname);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

// 确保public目录存在
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 复制必要的静态文件
const sourceDir = path.join(__dirname, '..', '..', 'public');
const filesToCopy = [
  'index.html',
  'dashboard.html',
  'client-dashboard.html',
  'admin-panel.html',
  'admin-login.html',
  'client-login.html',
  'mobile-login.html',
  'funds.html',
  'workflow.html',
  'monitoring-dashboard.html'
];

console.log('Copying public files...');

filesToCopy.forEach(file => {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(publicDir, file);
  
  if (fs.existsSync(sourceFile)) {
    // 确保目标目录存在
    const destDir = path.dirname(destFile);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(sourceFile, destFile);
    console.log(`Copied ${file}`);
  } else {
    console.log(`Source file not found: ${sourceFile}`);
  }
});

// 复制css和js目录
const dirsToCopy = ['css', 'js'];

dirsToCopy.forEach(dir => {
  const sourceDirPath = path.join(sourceDir, dir);
  const destDirPath = path.join(publicDir, dir);
  
  if (fs.existsSync(sourceDirPath)) {
    // 删除目标目录（如果存在）
    if (fs.existsSync(destDirPath)) {
      fs.rmSync(destDirPath, { recursive: true });
    }
    
    // 复制整个目录
    copyDir(sourceDirPath, destDirPath);
    console.log(`Copied directory ${dir}`);
  } else {
    console.log(`Source directory not found: ${sourceDirPath}`);
  }
});

// 递归复制目录的辅助函数
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Public files copied successfully.');