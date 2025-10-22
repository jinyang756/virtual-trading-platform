// Vercel API测试脚本
const https = require('https');

// 测试Vercel部署的API端点
const tests = [
  {
    name: '健康检查',
    path: '/health',
    method: 'GET'
  },
  {
    name: '用户登录API',
    path: '/api/users/login',
    method: 'POST',
    data: {
      username: 'testuser',
      password: 'testpassword'
    }
  },
  {
    name: '用户注册API',
    path: '/api/users/register',
    method: 'POST',
    data: {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'newpassword'
    }
  }
];

let passed = 0;
let failed = 0;

function runTest(test, callback) {
  const postData = test.data ? JSON.stringify(test.data) : '';
  
  const options = {
    hostname: 'prj-fh8ekvsqjgamrj9sbumiw1qprphz.vercel.app',
    port: 443,
    path: test.path,
    method: test.method,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    console.log(`${test.name}: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode >= 200 && res.statusCode < 300) {
      passed++;
    } else {
      failed++;
    }
    
    res.on('data', (chunk) => {
      // 读取响应数据
    });
    
    res.on('end', () => {
      callback();
    });
  });

  req.on('error', (e) => {
    console.log(`${test.name}: FAILED - ${e.message}`);
    failed++;
    callback();
  });

  if (postData) {
    req.write(postData);
  }
  
  req.end();
}

function runTests() {
  let index = 0;
  
  function next() {
    if (index >= tests.length) {
      console.log(`\n测试完成: ${passed} 通过, ${failed} 失败`);
      if (failed > 0) {
        console.log('\n建议检查:');
        console.log('1. Vercel部署配置是否正确');
        console.log('2. 环境变量是否设置');
        console.log('3. API路由是否正确注册');
      }
      process.exit(failed > 0 ? 1 : 0);
      return;
    }
    
    runTest(tests[index++], next);
  }
  
  next();
}

console.log('开始测试Vercel部署的API端点...\n');
runTests();