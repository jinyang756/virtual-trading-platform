/**
 * 环境配置文件
 * 用于根据域名设置正确的API基础URL
 */

// 检查当前环境并设置API基础URL
function getApiBaseUrl() {
  // 生产环境域名
  const productionDomains = [
    'jiuzhougroup.vip'
  ];
  
  // 检查当前域名
  const currentDomain = window.location.hostname;
  
  // 如果是生产环境域名，返回生产环境API地址
  if (productionDomains.includes(currentDomain)) {
    // 设置您的实际API地址 - 使用新的项目ID
    return 'https://prj-fh8ekvsqjgamrj9sbumiw1qprphz.vercel.app';
  }
  
  // Vercel环境检查
  if (currentDomain.includes('vercel.app')) {
    // 在Vercel环境中，使用当前域名作为API基础URL
    // 这样可以确保前端和后端在同一域名下
    return `https://${currentDomain}`;
  }
  
  // 开发环境或其他环境使用相对路径
  return '';
}

// 创建全局配置对象
const envConfig = {
  apiBaseUrl: getApiBaseUrl(),
  isProduction: window.location.hostname === 'jiuzhougroup.vip'
};

// 导出为全局变量
window.envConfig = envConfig;

// 如果是模块环境，也支持模块导入
if (typeof module !== 'undefined' && module.exports) {
  module.exports = envConfig;
}