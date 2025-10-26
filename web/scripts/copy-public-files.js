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

// 复制必要的静态文件（排除 index.html 以避免覆盖 Vite SPA 入口）
const sourceDir = path.join(__dirname, '..', '..', 'public');
const filesToCopy = [
  // 'index.html', // 排除以避免覆盖 Vite SPA 入口
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

console.log('Copying public files (excluding index.html)...');

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

// 复制目录
const dirsToCopy = ['css', 'js'];

dirsToCopy.forEach(dir => {
  const sourceDir = path.join(__dirname, '..', '..', 'public', dir);
  const destDir = path.join(publicDir, dir);
  
  if (fs.existsSync(sourceDir)) {
    copyDir(sourceDir, destDir);
    console.log(`Copied directory ${dir}`);
  } else {
    console.log(`Source directory not found: ${sourceDir}`);
  }
});

// 清理可能存在的 index.html，防止覆盖 Vite 入口
const indexInPublic = path.join(publicDir, 'index.html');
if (fs.existsSync(indexInPublic)) {
  fs.rmSync(indexInPublic);
}

// 递归复制目录的辅助函数
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  });
}

console.log('Public files copied successfully (index.html excluded to preserve SPA entry).');