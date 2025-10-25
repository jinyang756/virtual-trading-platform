const io = require('socket.io-client');
const jwt = require('jsonwebtoken');

// 使用与服务器相同的密钥生成JWT令牌
const JWT_SECRET = process.env.JWT_SECRET || 'virtual_trading_platform_secret_key_2025';

// 生成有效的JWT令牌
const token = jwt.sign(
  { 
    userId: '123',
    username: 'testuser'
  },
  JWT_SECRET,
  { expiresIn: '24h' }
);

// 连接到服务器
const socket = io('http://localhost:3001');

console.log('连接到服务器...');

socket.on('connect', () => {
  console.log('已连接到服务器');
  
  // 认证
  socket.emit('authenticate', { token });
});

socket.on('auth_success', (data) => {
  console.log('认证成功:', data);
  
  // 模拟发送交易请求
  const tradeData = {
    symbol: 'NEW_TEST_FUTURE',
    quantity: 10,
    price: 100,
    type: 'buy'
  };
  
  console.log('发送交易请求:', tradeData);
  
  socket.emit('place_trade', tradeData, (response) => {
    console.log('交易响应:', response);
    
    if (response.success) {
      console.log('交易成功!');
      
      // 等待一段时间后发送卖出交易
      setTimeout(() => {
        const sellTradeData = {
          symbol: 'NEW_TEST_FUTURE',
          quantity: 5,
          price: 110,
          type: 'sell'
        };
        
        console.log('发送卖出交易请求:', sellTradeData);
        
        socket.emit('place_trade', sellTradeData, (sellResponse) => {
          console.log('卖出交易响应:', sellResponse);
          
          if (sellResponse.success) {
            console.log('卖出交易成功!');
          } else {
            console.log('卖出交易失败:', sellResponse.error);
          }
          
          // 断开连接
          socket.disconnect();
        });
      }, 2000);
    } else {
      console.log('交易失败:', response.error);
      socket.disconnect();
    }
  });
});

socket.on('auth_error', (data) => {
  console.log('认证失败:', data);
  socket.disconnect();
});

socket.on('error', (error) => {
  console.log('Socket错误:', error);
  socket.disconnect();
});