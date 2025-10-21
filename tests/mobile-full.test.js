/**
 * 移动端完整功能测试
 * 验证移动端的所有核心功能
 */

const fs = require('fs');
const path = require('path');

// 测试移动端页面完整性
describe('移动端页面完整性验证', () => {
  test('所有移动端页面文件存在', () => {
    const mobilePages = [
      'index.html',
      'market.html',
      'trade.html',
      'profile.html'
    ];
    
    mobilePages.forEach(page => {
      const pagePath = path.join(__dirname, '../public/mobile', page);
      expect(fs.existsSync(pagePath)).toBe(true);
    });
    
    // 检查登录页面（在public目录下）
    const loginPath = path.join(__dirname, '../public/mobile-login.html');
    expect(fs.existsSync(loginPath)).toBe(true);
  });

  test('移动端页面包含必要的UI组件', () => {
    const pages = ['index.html', 'market.html', 'trade.html', 'profile.html'];
    
    pages.forEach(page => {
      const pagePath = path.join(__dirname, '../public/mobile', page);
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      
      // 检查是否包含底部导航栏
      expect(pageContent).toContain('class="tabbar"');
      
      // 检查是否包含头部
      expect(pageContent).toContain('class="header"');
      
      // 检查是否包含内容区域
      expect(pageContent).toContain('class="content"');
    });
  });
});

// 测试移动端JavaScript功能
describe('移动端JavaScript功能验证', () => {
  test('移动端存储工具功能完整', () => {
    const storagePath = path.join(__dirname, '../public/js/mobile-storage.js');
    const storageContent = fs.readFileSync(storagePath, 'utf8');
    
    // 检查是否包含必要的方法
    expect(storageContent).toContain('set(');
    expect(storageContent).toContain('get(');
    expect(storageContent).toContain('remove(');
    expect(storageContent).toContain('clear(');
  });

  test('移动端环境配置功能完整', () => {
    const envPath = path.join(__dirname, '../public/js/env-config.js');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // 检查是否包含生产环境配置
    expect(envContent).toContain('jiuzhougroup.vip');
    
    // 检查是否包含API基础URL配置
    expect(envContent).toContain('apiBaseUrl');
  });
});

// 测试移动端认证流程
describe('移动端认证流程验证', () => {
  test('登录页面功能完整', () => {
    const loginPath = path.join(__dirname, '../public/mobile-login.html');
    const loginContent = fs.readFileSync(loginPath, 'utf8');
    
    // 检查表单验证功能
    expect(loginContent).toContain('required');
    
    // 检查验证码功能
    expect(loginContent).toContain('captcha');
    
    // 检查JavaScript功能
    expect(loginContent).toContain('generateCaptcha');
  });

  test('各页面包含认证检查', () => {
    const pages = ['index.html', 'market.html', 'trade.html', 'profile.html'];
    
    pages.forEach(page => {
      const pagePath = path.join(__dirname, '../public/mobile', page);
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      
      // 检查是否包含认证检查
      expect(pageContent).toContain('isAuthenticated');
    });
  });
});

// 测试移动端核心功能
describe('移动端核心功能验证', () => {
  test('首页功能完整', () => {
    const indexPath = path.join(__dirname, '../public/mobile/index.html');
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // 检查是否包含资产概览
    expect(indexContent).toContain('asset-overview');
    
    // 检查是否包含快捷交易入口
    expect(indexContent).toContain('quick-entries');
    
    // 检查是否包含最近持仓
    expect(indexContent).toContain('最近持仓');
  });

  test('行情页面功能完整', () => {
    const marketPath = path.join(__dirname, '../public/mobile/market.html');
    const marketContent = fs.readFileSync(marketPath, 'utf8');
    
    // 检查是否包含市场列表
    expect(marketContent).toContain('market-list');
    
    // 检查是否包含图表容器
    expect(marketContent).toContain('chart-container');
    
    // 检查是否包含市场资讯
    expect(marketContent).toContain('市场资讯');
  });

  test('交易页面功能完整', () => {
    const tradePath = path.join(__dirname, '../public/mobile/trade.html');
    const tradeContent = fs.readFileSync(tradePath, 'utf8');
    
    // 检查是否包含交易类型选择
    expect(tradeContent).toContain('tradeType');
    
    // 检查是否包含交易品种选择
    expect(tradeContent).toContain('tradeAsset');
    
    // 检查是否包含交易方向选择
    expect(tradeContent).toContain('direction');
    
    // 检查是否包含交易数量输入
    expect(tradeContent).toContain('amount');
  });

  test('个人资料页面功能完整', () => {
    const profilePath = path.join(__dirname, '../public/mobile/profile.html');
    const profileContent = fs.readFileSync(profilePath, 'utf8');
    
    // 检查是否包含用户信息
    expect(profileContent).toContain('user-info');
    
    // 检查是否包含资产概览
    expect(profileContent).toContain('asset-overview');
    
    // 检查是否包含账户信息
    expect(profileContent).toContain('账户信息');
    
    // 检查是否包含交易统计
    expect(profileContent).toContain('交易统计');
    
    // 检查是否包含功能菜单
    expect(profileContent).toContain('功能菜单');
  });
});

// 测试移动端用户体验
describe('移动端用户体验验证', () => {
  test('所有页面包含Toast提示功能', () => {
    const pages = ['index.html', 'market.html', 'trade.html', 'profile.html'];
    
    pages.forEach(page => {
      const pagePath = path.join(__dirname, '../public/mobile', page);
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      
      // 检查是否包含Toast提示
      expect(pageContent).toContain('id="toast"');
      expect(pageContent).toContain('showToast');
    });
  });

  test('所有页面包含登出功能', () => {
    const pages = ['index.html', 'market.html', 'trade.html', 'profile.html'];
    
    pages.forEach(page => {
      const pagePath = path.join(__dirname, '../public/mobile', page);
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      
      // 检查是否包含登出按钮
      expect(pageContent).toContain('logoutBtn');
      expect(pageContent).toContain('handleLogout');
    });
  });

  test('页面响应式设计正确', () => {
    const pages = ['index.html', 'market.html', 'trade.html', 'profile.html'];
    const loginPath = path.join(__dirname, '../public/mobile-login.html');
    const loginContent = fs.readFileSync(loginPath, 'utf8');
    
    // 检查登录页面
    expect(loginContent).toContain('viewport');
    expect(loginContent).toContain('max-width: 500px');
    
    // 检查其他页面
    pages.forEach(page => {
      const pagePath = path.join(__dirname, '../public/mobile', page);
      const pageContent = fs.readFileSync(pagePath, 'utf8');
      
      // 检查是否包含viewport设置
      expect(pageContent).toContain('viewport');
      
      // 检查是否包含移动端优化的CSS
      expect(pageContent).toContain('max-width: 500px');
    });
  });
});