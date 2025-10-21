/**
 * 移动端认证功能测试
 * 验证移动端的登录、登出和用户认证功能
 */

const fs = require('fs');
const path = require('path');

// 测试移动端认证相关文件
describe('移动端认证功能验证', () => {
  test('移动端登录页面存在', () => {
    const loginPath = path.join(__dirname, '../public/mobile-login.html');
    expect(fs.existsSync(loginPath)).toBe(true);
  });

  test('移动端登录页面包含认证功能', () => {
    const loginPath = path.join(__dirname, '../public/mobile-login.html');
    const loginContent = fs.readFileSync(loginPath, 'utf8');
    
    // 检查是否包含登录表单
    expect(loginContent).toContain('id="loginForm"');
    
    // 检查是否包含用户名和密码输入框
    expect(loginContent).toContain('id="username"');
    expect(loginContent).toContain('id="password"');
    
    // 检查是否包含验证码
    expect(loginContent).toContain('id="captcha"');
    
    // 检查是否包含注册和忘记密码链接
    expect(loginContent).toContain('id="registerLink"');
    expect(loginContent).toContain('id="forgotPasswordLink"');
  });

  test('移动端首页包含用户认证检查', () => {
    const indexPath = path.join(__dirname, '../public/mobile/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // 检查是否包含登出按钮
    expect(indexContent).toContain('id="logoutBtn"');
    
    // 检查是否包含用户认证检查脚本
    expect(indexContent).toContain('mobileStorage.get(\'userData\')');
  });

  test('移动端交易页面包含用户认证检查', () => {
    const tradePath = path.join(__dirname, '../public/mobile/trade.html');
    const tradeContent = fs.readFileSync(tradePath, 'utf8');
    
    // 检查是否包含登出按钮
    expect(tradeContent).toContain('id="logoutBtn"');
    
    // 检查是否包含用户认证检查脚本
    expect(tradeContent).toContain('mobileStorage.get(\'userData\')');
  });

  test('移动端行情页面包含用户认证检查', () => {
    const marketPath = path.join(__dirname, '../public/mobile/market.html');
    const marketContent = fs.readFileSync(marketPath, 'utf8');
    
    // 检查是否包含登出按钮
    expect(marketContent).toContain('id="logoutBtn"');
    
    // 检查是否包含用户认证检查脚本
    expect(marketContent).toContain('mobileStorage.get(\'userData\')');
  });

  test('移动端个人资料页面包含用户认证检查和登出功能', () => {
    const profilePath = path.join(__dirname, '../public/mobile/profile.html');
    const profileContent = fs.readFileSync(profilePath, 'utf8');
    
    // 检查是否包含登出按钮
    expect(profileContent).toContain('id="logoutBtn"');
    
    // 检查是否包含用户认证检查脚本
    expect(profileContent).toContain('mobileStorage.get(\'userData\')');
  });

  test('移动端存储工具存在', () => {
    const storagePath = path.join(__dirname, '../public/js/mobile-storage.js');
    expect(fs.existsSync(storagePath)).toBe(true);
  });

  test('移动端环境配置文件存在', () => {
    const envPath = path.join(__dirname, '../public/js/env-config.js');
    expect(fs.existsSync(envPath)).toBe(true);
  });
});

// 测试路由配置
describe('移动端路由配置验证', () => {
  test('路由文件存在', () => {
    const routesPath = path.join(__dirname, '../src/routes/index.js');
    expect(fs.existsSync(routesPath)).toBe(true);
  });

  test('移动端路由配置正确', () => {
    const routesPath = path.join(__dirname, '../src/routes/index.js');
    const routesContent = fs.readFileSync(routesPath, 'utf8');
    
    // 检查是否包含移动端登录路由
    expect(routesContent).toContain('/mobile/login');
    
    // 检查是否包含移动端主页路由
    expect(routesContent).toContain('/mobile');
    
    // 检查是否包含移动端行情路由
    expect(routesContent).toContain('/mobile/market');
    
    // 检查是否包含移动端交易路由
    expect(routesContent).toContain('/mobile/trade');
    
    // 检查是否包含移动端个人资料路由
    expect(routesContent).toContain('/mobile/profile');
  });
});