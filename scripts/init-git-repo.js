/**
 * Git仓库初始化脚本
 * 用于帮助用户将本地项目与GitHub远程仓库关联
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 项目根目录
const projectRoot = path.resolve(__dirname, '..');

// 远程仓库信息
const REMOTE_REPO = 'https://github.com/jinyang756/Debox-NFT-Sim.git';
const DEFAULT_BRANCH = 'main';

console.log('=== 虚拟交易平台 Git 仓库初始化脚本 ===\n');

// 检查Git是否已安装
function isGitInstalled() {
  try {
    execSync('git --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// 检查是否已经是Git仓库
function isGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { cwd: projectRoot, stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// 获取当前分支名称
function getCurrentBranch() {
  try {
    const branch = execSync('git branch --show-current', { cwd: projectRoot, encoding: 'utf-8' });
    return branch.trim();
  } catch (error) {
    return null;
  }
}

// 检查远程仓库是否已配置
function isRemoteConfigured() {
  try {
    const remotes = execSync('git remote -v', { cwd: projectRoot, encoding: 'utf-8' });
    return remotes.includes('origin') && remotes.includes(REMOTE_REPO);
  } catch (error) {
    return false;
  }
}

// 主函数
async function main() {
  console.log('正在检查系统环境...\n');
  
  // 检查Git是否安装
  if (!isGitInstalled()) {
    console.log('❌ 未检测到Git安装');
    console.log('\n请先安装Git:');
    console.log('1. 访问 https://git-scm.com/download/win 下载Git for Windows');
    console.log('2. 运行安装程序并按照默认设置安装');
    console.log('3. 重新启动命令行工具');
    console.log('4. 重新运行此脚本');
    return;
  }
  
  console.log('✅ Git已安装');
  
  // 检查是否是Git仓库
  if (!isGitRepo()) {
    console.log('❌ 当前目录不是Git仓库');
    console.log('\n请先初始化Git仓库:');
    console.log('git init');
    return;
  }
  
  console.log('✅ 当前目录是Git仓库');
  
  // 检查远程仓库配置
  if (isRemoteConfigured()) {
    console.log('✅ 远程仓库已正确配置');
  } else {
    console.log('⚠️  远程仓库未配置或配置不正确');
    
    try {
      // 添加远程仓库
      execSync(`git remote add origin ${REMOTE_REPO}`, { cwd: projectRoot });
      console.log('✅ 远程仓库已添加');
    } catch (error) {
      console.log('❌ 添加远程仓库失败:', error.message);
      return;
    }
  }
  
  // 检查分支名称
  const currentBranch = getCurrentBranch();
  if (currentBranch) {
    console.log(`✅ 当前分支: ${currentBranch}`);
    
    if (currentBranch !== DEFAULT_BRANCH) {
      console.log(`\n⚠️  当前分支不是默认分支 (${DEFAULT_BRANCH})`);
      console.log('建议重命名当前分支:');
      console.log(`git branch -M ${DEFAULT_BRANCH}`);
    }
  } else {
    console.log('⚠️  无法确定当前分支');
  }
  
  // 显示下一步操作
  console.log('\n=== 下一步操作 ===');
  console.log('1. 配置Git用户信息 (如果尚未配置):');
  console.log('   git config --global user.name "Your Name"');
  console.log('   git config --global user.email "your.email@example.com"');
  console.log('\n2. 添加所有文件到暂存区:');
  console.log('   git add .');
  console.log('\n3. 提交更改:');
  console.log('   git commit -m "Initial commit"');
  console.log('\n4. 推送到远程仓库:');
  console.log(`   git push -u origin ${DEFAULT_BRANCH}`);
  
  console.log('\n=== 仓库信息 ===');
  console.log(`远程仓库: ${REMOTE_REPO}`);
  console.log(`默认分支: ${DEFAULT_BRANCH}`);
  console.log(`项目路径: ${projectRoot}`);
  
  console.log('\n✅ Git仓库初始化脚本执行完成');
}

// 执行主函数
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 脚本执行出错:', error.message);
    process.exit(1);
  });
}

module.exports = {
  isGitInstalled,
  isGitRepo,
  isRemoteConfigured,
  getCurrentBranch
};