/**
 * 移动端功能验证测试
 * 验证移动端 v1.0 版本的核心功能
 */

const fs = require('fs');
const path = require('path');

// 测试移动端页面文件是否存在
describe('移动端页面文件验证', () => {
  test('首页文件存在', () => {
    const indexPath = path.join(__dirname, '../public/mobile/index.html');
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('交易页面文件存在', () => {
    const tradePath = path.join(__dirname, '../public/mobile/trade.html');
    expect(fs.existsSync(tradePath)).toBe(true);
  });

  test('行情页面文件存在', () => {
    const marketPath = path.join(__dirname, '../public/mobile/market.html');
    expect(fs.existsSync(marketPath)).toBe(true);
  });

  test('个人资料页面文件存在', () => {
    const profilePath = path.join(__dirname, '../public/mobile/profile.html');
    expect(fs.existsSync(profilePath)).toBe(true);
  });
});

// 测试配置文件
describe('移动端配置文件验证', () => {
  test('移动端服务器文件存在', () => {
    const serverPath = path.join(__dirname, '../mobile-server.js');
    expect(fs.existsSync(serverPath)).toBe(true);
  });

  test('Vercel配置文件存在', () => {
    const vercelConfigPath = path.join(__dirname, '../vercel-mobile.json');
    expect(fs.existsSync(vercelConfigPath)).toBe(true);
  });

  test('环境配置文件存在', () => {
    const envConfigPath = path.join(__dirname, '../public/js/env-config.js');
    expect(fs.existsSync(envConfigPath)).toBe(true);
  });

  test('环境配置文件包含正确的生产环境API地址', () => {
    const envConfigPath = path.join(__dirname, '../public/js/env-config.js');
    const envConfigContent = fs.readFileSync(envConfigPath, 'utf8');
    expect(envConfigContent).toContain('prj-wfqnbnlou9tvlibkz0oqp641hqah.vercel.app');
  });
});

// 测试部署脚本
describe('移动端部署脚本验证', () => {
  test('部署验证脚本存在', () => {
    const deployScriptPath = path.join(__dirname, '../scripts/deploy-and-verify-mobile.js');
    expect(fs.existsSync(deployScriptPath)).toBe(true);
  });
});