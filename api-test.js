const http = require('http');

// 测试API端点
const tests = [
  {
    name: '首页',
    path: '/',
    method: 'GET'
  },
  {
    name: '移动端登录页面',
    path: '/mobile/login',
    method: 'GET'
  },
  {
    name: '健康检查',
    path: '/health',
    method: 'GET'
  }
];

let passed = 0;
let failed = 0;

function runTest(test, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: test.path,
    method: test.method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`${test.name}: ${res.statusCode} ${res.statusMessage}`);
    if (res.statusCode === 200) {
      passed++;
    } else {
      failed++;
    }
    callback();
  });

  req.on('error', (e) => {
    console.log(`${test.name}: FAILED - ${e.message}`);
    failed++;
    callback();
  });

  req.end();
}

function runTests() {
  let index = 0;
  
  function next() {
    if (index >= tests.length) {
      console.log(`\n测试完成: ${passed} 通过, ${failed} 失败`);
      process.exit(failed > 0 ? 1 : 0);
      return;
    }
    
    runTest(tests[index++], next);
  }
  
  next();
}

runTests();