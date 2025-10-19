const http = require('http');

async function testAPI() {
  console.log('测试API功能...');
  
  // 测试注册
  console.log('\n1. 测试用户注册...');
  const registerData = JSON.stringify({
    username: 'mobileuser',
    email: 'mobile@test.com',
    password: 'mobile123'
  });
  
  const registerOptions = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/users/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(registerData)
    }
  };
  
  const registerReq = http.request(registerOptions, (res) => {
    let responseData = '';
    
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      console.log(`注册响应状态码: ${res.statusCode}`);
      console.log(`注册响应数据: ${responseData}`);
      
      if (res.statusCode === 201) {
        console.log('注册成功!');
        
        // 测试登录
        console.log('\n2. 测试用户登录...');
        const loginData = JSON.stringify({
          username: 'mobileuser',
          password: 'mobile123'
        });
        
        const loginOptions = {
          hostname: 'localhost',
          port: 3001,
          path: '/api/users/login',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(loginData)
          }
        };
        
        const loginReq = http.request(loginOptions, (res) => {
          let loginResponseData = '';
          
          res.on('data', (chunk) => {
            loginResponseData += chunk;
          });
          
          res.on('end', () => {
            console.log(`登录响应状态码: ${res.statusCode}`);
            console.log(`登录响应数据: ${loginResponseData}`);
            
            if (res.statusCode === 200) {
              console.log('登录成功!');
            } else {
              console.log('登录失败!');
            }
          });
        });
        
        loginReq.on('error', (error) => {
          console.error('登录请求错误:', error.message);
        });
        
        loginReq.write(loginData);
        loginReq.end();
      } else {
        console.log('注册失败!');
      }
    });
  });
  
  registerReq.on('error', (error) => {
    console.error('注册请求错误:', error.message);
  });
  
  registerReq.write(registerData);
  registerReq.end();
}

testAPI();