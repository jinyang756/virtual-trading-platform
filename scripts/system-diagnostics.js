#!/usr/bin/env node

const https = require('https');
const dns = require('dns').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// 配置参数
const CONFIG = {
  frontendDomain: 'jiuzhougroup.vip',
  backendDomain: 'api.jcstjj.top',
  healthEndpoint: '/health',
  opsStatusEndpoint: '/api/ops/status',
  ports: [80, 443]
};

// 颜色代码
const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 打印带颜色的消息
function printMessage(color, message) {
  console.log(`${color}${message}${COLORS.reset}`);
}

function printSuccess(message) {
  printMessage(COLORS.green, `✓ ${message}`);
}

function printError(message) {
  printMessage(COLORS.red, `✗ ${message}`);
}

function printWarning(message) {
  printMessage(COLORS.yellow, `⚠ ${message}`);
}

function printInfo(message) {
  printMessage(COLORS.blue, `ℹ ${message}`);
}

function printHeader(message) {
  printMessage(COLORS.cyan, `\n${message}`);
  printMessage(COLORS.cyan, '='.repeat(50));
}

// 执行 HTTP 请求
function httpRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data
        });
      });
    });
    
    req.on('error', (e) => {
      reject(e);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// 检查 DNS 解析
async function checkDNS(domain) {
  try {
    printInfo(`检查 DNS 解析: ${domain}`);
    const addresses = await dns.resolve(domain);
    printSuccess(`DNS 解析成功: ${addresses.join(', ')}`);
    return true;
  } catch (error) {
    printError(`DNS 解析失败: ${error.message}`);
    return false;
  }
}

// 检查端口连通性
async function checkPortConnectivity(domain, port) {
  try {
    printInfo(`检查端口连通性: ${domain}:${port}`);
    // 使用 PowerShell 测试端口连接
    const command = `Test-NetConnection -ComputerName ${domain} -Port ${port} -WarningAction SilentlyContinue | Select-Object -ExpandProperty TcpTestSucceeded`;
    const { stdout } = await execPromise(command, { shell: 'powershell.exe' });
    const success = stdout.trim() === 'True';
    
    if (success) {
      printSuccess(`端口 ${port} 连通性正常`);
    } else {
      printError(`端口 ${port} 连通性异常`);
    }
    
    return success;
  } catch (error) {
    printError(`端口连通性检查失败: ${error.message}`);
    return false;
  }
}

// 检查 SSL 证书
async function checkSSLCertificate(domain) {
  try {
    printInfo(`检查 SSL 证书: ${domain}`);
    
    const options = {
      hostname: domain,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false
    };
    
    const result = await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        const cert = res.socket.getPeerCertificate();
        if (cert && Object.keys(cert).length > 0) {
          resolve({
            valid: true,
            subject: cert.subject,
            issuer: cert.issuer,
            validFrom: cert.valid_from,
            validTo: cert.valid_to
          });
        } else {
          reject(new Error('无法获取证书信息'));
        }
      });
      
      req.on('error', (e) => {
        reject(e);
      });
      
      req.setTimeout(10000, () => {
        req.destroy();
        reject(new Error('请求超时'));
      });
      
      req.end();
    });
    
    if (result.valid) {
      printSuccess(`SSL 证书有效`);
      printInfo(`  主题: ${result.subject.CN}`);
      printInfo(`  颁发者: ${result.issuer.CN}`);
      printInfo(`  有效期: ${result.validFrom} 至 ${result.validTo}`);
      
      // 检查证书是否即将过期
      const expireDate = new Date(result.validTo);
      const now = new Date();
      const daysUntilExpiry = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 30) {
        printWarning(`证书将在 ${daysUntilExpiry} 天后过期`);
      } else {
        printSuccess(`证书有效期充足 (${daysUntilExpiry} 天)`);
      }
    }
    
    return true;
  } catch (error) {
    printError(`SSL 证书检查失败: ${error.message}`);
    return false;
  }
}

// 检查前端页面加载
async function checkFrontend(domain) {
  try {
    printInfo(`检查前端页面加载: https://${domain}`);
    const response = await httpRequest(`https://${domain}`);
    
    if (response.statusCode === 200) {
      printSuccess(`前端页面加载成功 (状态码: ${response.statusCode})`);
      
      // 检查是否包含关键内容
      if (response.data.includes('虚拟交易平台')) {
        printSuccess(`页面内容正确`);
      } else {
        printWarning(`页面内容可能不正确`);
      }
      
      return true;
    } else {
      printError(`前端页面加载失败 (状态码: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    printError(`前端页面加载失败: ${error.message}`);
    return false;
  }
}

// 检查后端健康状态
async function checkBackendHealth(domain) {
  try {
    printInfo(`检查后端健康状态: https://${domain}${CONFIG.healthEndpoint}`);
    const response = await httpRequest(`https://${domain}${CONFIG.healthEndpoint}`);
    
    if (response.statusCode === 200) {
      printSuccess(`后端健康检查成功 (状态码: ${response.statusCode})`);
      
      // 解析响应数据
      try {
        const data = JSON.parse(response.data);
        if (data.status === 'OK') {
          printSuccess(`后端服务运行正常`);
        } else {
          printWarning(`后端服务状态异常: ${data.status}`);
        }
      } catch (parseError) {
        printWarning(`无法解析健康检查响应: ${parseError.message}`);
      }
      
      return true;
    } else {
      printError(`后端健康检查失败 (状态码: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    printError(`后端健康检查失败: ${error.message}`);
    return false;
  }
}

// 检查后端 API 接口
async function checkBackendAPI(domain) {
  try {
    printInfo(`检查后端 API 接口: https://${domain}${CONFIG.opsStatusEndpoint}`);
    const response = await httpRequest(`https://${domain}${CONFIG.opsStatusEndpoint}`);
    
    // API 接口可能需要认证，所以 401 状态码也认为是连通的
    if (response.statusCode === 200 || response.statusCode === 401) {
      printSuccess(`后端 API 接口连通成功 (状态码: ${response.statusCode})`);
      return true;
    } else {
      printError(`后端 API 接口连通失败 (状态码: ${response.statusCode})`);
      return false;
    }
  } catch (error) {
    printError(`后端 API 接口连通失败: ${error.message}`);
    return false;
  }
}

// 检查 CDN 资源加载
async function checkCDNResources(domain) {
  try {
    printInfo(`检查 CDN 资源加载: https://${domain}`);
    
    // 尝试获取页面并检查是否有静态资源链接
    const response = await httpRequest(`https://${domain}`);
    
    if (response.statusCode === 200) {
      // 简单检查是否有 CSS 和 JS 资源
      const hasCSS = response.data.includes('.css');
      const hasJS = response.data.includes('.js');
      
      if (hasCSS) {
        printSuccess(`检测到 CSS 资源`);
      } else {
        printWarning(`未检测到 CSS 资源`);
      }
      
      if (hasJS) {
        printSuccess(`检测到 JS 资源`);
      } else {
        printWarning(`未检测到 JS 资源`);
      }
      
      return hasCSS || hasJS;
    } else {
      printError(`无法获取页面内容进行 CDN 资源检查`);
      return false;
    }
  } catch (error) {
    printError(`CDN 资源检查失败: ${error.message}`);
    return false;
  }
}

// 主诊断函数
async function runDiagnostics() {
  printHeader('系统诊断工具');
  printInfo('开始执行系统诊断...');
  
  const startTime = new Date();
  
  // 前端诊断
  printHeader('前端诊断');
  const frontendDNS = await checkDNS(CONFIG.frontendDomain);
  let frontendConnectivity = true;
  for (const port of CONFIG.ports) {
    const result = await checkPortConnectivity(CONFIG.frontendDomain, port);
    frontendConnectivity = frontendConnectivity && result;
  }
  
  const frontendSSL = await checkSSLCertificate(CONFIG.frontendDomain);
  const frontendLoad = await checkFrontend(CONFIG.frontendDomain);
  const frontendCDN = await checkCDNResources(CONFIG.frontendDomain);
  
  // 后端诊断
  printHeader('后端诊断');
  const backendDNS = await checkDNS(CONFIG.backendDomain);
  let backendConnectivity = true;
  for (const port of CONFIG.ports) {
    const result = await checkPortConnectivity(CONFIG.backendDomain, port);
    backendConnectivity = backendConnectivity && result;
  }
  
  const backendSSL = await checkSSLCertificate(CONFIG.backendDomain);
  const backendHealth = await checkBackendHealth(CONFIG.backendDomain);
  const backendAPI = await checkBackendAPI(CONFIG.backendDomain);
  
  // 汇总结果
  printHeader('诊断结果汇总');
  const endTime = new Date();
  const duration = (endTime - startTime) / 1000;
  
  printInfo(`诊断完成，耗时: ${duration.toFixed(2)} 秒`);
  
  // 前端总体状态
  const frontendOverall = frontendDNS && frontendConnectivity && frontendSSL && frontendLoad;
  if (frontendOverall) {
    printSuccess('前端系统状态: 正常');
  } else {
    printError('前端系统状态: 异常');
  }
  
  // 后端总体状态
  const backendOverall = backendDNS && backendConnectivity && backendSSL && backendHealth;
  if (backendOverall) {
    printSuccess('后端系统状态: 正常');
  } else {
    printError('后端系统状态: 异常');
  }
  
  // 系统总体状态
  if (frontendOverall && backendOverall) {
    printSuccess('系统整体状态: 正常');
    printMessage(COLORS.green, '\n🎉 系统运行正常，所有检查项通过！');
  } else {
    printError('系统整体状态: 异常');
    printMessage(COLORS.red, '\n❌ 系统存在异常，请检查上述错误信息。');
  }
  
  // 提供建议
  printHeader('维护建议');
  printInfo('1. 定期运行此诊断工具检查系统状态');
  printInfo('2. 监控 SSL 证书有效期，及时续期');
  printInfo('3. 检查服务器资源使用情况');
  printInfo('4. 查看应用日志，及时发现潜在问题');
}

// 执行诊断
runDiagnostics().catch((error) => {
  printError(`诊断过程中发生未预期的错误: ${error.message}`);
  process.exit(1);
});