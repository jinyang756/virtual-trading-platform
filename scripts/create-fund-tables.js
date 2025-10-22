const axios = require('axios');

async function createTables() {
  try {
    // 创建 funds 表
    console.log('正在创建 funds 表...');
    const fundsResponse = await axios.post('http://localhost:3000/api/admin/tables', {
      tableName: 'funds',
      description: '私募基金基础信息表'
    });
    console.log('funds 表创建结果:', fundsResponse.data);

    // 创建 fund_net_value 表
    console.log('正在创建 fund_net_value 表...');
    const netValueResponse = await axios.post('http://localhost:3000/api/admin/tables', {
      tableName: 'fund_net_value',
      description: '基金净值曲线表'
    });
    console.log('fund_net_value 表创建结果:', netValueResponse.data);

    // 创建 fund_detail 表
    console.log('正在创建 fund_detail 表...');
    const detailResponse = await axios.post('http://localhost:3000/api/admin/tables', {
      tableName: 'fund_detail',
      description: '基金详情表'
    });
    console.log('fund_detail 表创建结果:', detailResponse.data);

    // 创建 fund_insight 表
    console.log('正在创建 fund_insight 表...');
    const insightResponse = await axios.post('http://localhost:3000/api/admin/tables', {
      tableName: 'fund_insight',
      description: '基金市场观点表'
    });
    console.log('fund_insight 表创建结果:', insightResponse.data);

    console.log('所有表创建完成！');
  } catch (error) {
    console.error('创建表时出错:', error.response ? error.response.data : error.message);
  }
}

createTables();