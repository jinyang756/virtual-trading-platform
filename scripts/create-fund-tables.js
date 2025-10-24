const axios = require('axios');

// 使用新的云服务端点创建表
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
const baseId = process.env.TEABLE_BASE_ID || 'spcvpwg10UdGxULD4g6';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';

async function createTables() {
  try {
    // 创建 axios 实例用于管理操作
    const adminClient = axios.create({
      baseURL: `${apiBase}/api/base/${baseId}`,
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // 创建私募基金管理系统核心数据表
    console.log('正在创建私募基金管理系统核心数据表...');
    
    // 创建 funds 表
    console.log('正在创建 funds 表...');
    const fundsResponse = await adminClient.post('/table', {
      name: 'funds',
      description: '私募基金基础信息表'
    });
    console.log('funds 表创建结果:', fundsResponse.data);

    // 创建 fund_net_value 表
    console.log('正在创建 fund_net_value 表...');
    const netValueResponse = await adminClient.post('/table', {
      name: 'fund_net_value',
      description: '基金净值曲线表'
    });
    console.log('fund_net_value 表创建结果:', netValueResponse.data);

    // 创建 fund_detail 表
    console.log('正在创建 fund_detail 表...');
    const detailResponse = await adminClient.post('/table', {
      name: 'fund_detail',
      description: '基金详情表'
    });
    console.log('fund_detail 表创建结果:', detailResponse.data);

    // 创建 fund_insight 表
    console.log('正在创建 fund_insight 表...');
    const insightResponse = await adminClient.post('/table', {
      name: 'fund_insight',
      description: '基金市场观点表'
    });
    console.log('fund_insight 表创建结果:', insightResponse.data);

    // 创建 users 表
    console.log('正在创建 users 表...');
    const usersResponse = await adminClient.post('/table', {
      name: 'users',
      description: '用户信息表'
    });
    console.log('users 表创建结果:', usersResponse.data);

    // 创建 transactions 表
    console.log('正在创建 transactions 表...');
    const transactionsResponse = await adminClient.post('/table', {
      name: 'transactions',
      description: '交易记录表'
    });
    console.log('transactions 表创建结果:', transactionsResponse.data);

    // 创建 positions 表
    console.log('正在创建 positions 表...');
    const positionsResponse = await adminClient.post('/table', {
      name: 'positions',
      description: '持仓记录表'
    });
    console.log('positions 表创建结果:', positionsResponse.data);

    console.log('所有表创建完成！');
  } catch (error) {
    console.error('创建表时出错:');
    if (error.response) {
      console.error('状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
      console.error('响应头:', error.response.headers);
    } else {
      console.error('错误信息:', error.message);
      console.error('错误堆栈:', error.stack);
    }
  }
}

createTables();