const http = require('http');

// 测试主页
http.get('http://localhost:3002/', (res) => {
  console.log('主页状态码:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('聚财众发')) {
      console.log('✓ 主页内容正确');
    } else {
      console.log('✗ 主页内容不正确');
    }
  });
}).on('error', (err) => {
  console.log('主页请求错误:', err.message);
});

// 测试健康检查
http.get('http://localhost:3002/health', (res) => {
  console.log('健康检查状态码:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('OK')) {
      console.log('✓ 健康检查正常');
    } else {
      console.log('✗ 健康检查异常');
    }
  });
}).on('error', (err) => {
  console.log('健康检查请求错误:', err.message);
});

// 测试移动端页面
http.get('http://localhost:3002/mobile/', (res) => {
  console.log('移动端主页状态码:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    if (data.includes('聚财众发')) {
      console.log('✓ 移动端主页内容正确');
    } else {
      console.log('✗ 移动端主页内容不正确');
    }
  });
}).on('error', (err) => {
  console.log('移动端主页请求错误:', err.message);
});