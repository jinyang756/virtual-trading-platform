const dbAdapter = require('./src/database/dbAdapter');

async function checkExistingTables() {
  try {
    console.log('测试数据库连接...');
    const connectionResult = await dbAdapter.testConnection();
    console.log('连接测试结果:', connectionResult);
    
    if (!connectionResult.success) {
      console.error('数据库连接失败:', connectionResult.message);
      return;
    }
    
    console.log('获取所有表...');
    const tables = await dbAdapter.getTables();
    
    console.log('现有表列表:');
    if (tables && Array.isArray(tables)) {
      tables.forEach(table => {
        console.log(`- ${table.id}: ${table.name} (${table.description || '无描述'})`);
      });
      
      // 更新config/teableConfig.js中的表ID映射
      console.log('\n请手动更新 config/teableConfig.js 中的表ID映射:');
      tables.forEach(table => {
        console.log(`${table.name}: '${table.id}'`);
      });
    } else {
      console.log('未找到任何表');
    }
  } catch (error) {
    console.error('检查表时出错:', error.message);
    if (error.stack) {
      console.error('错误堆栈:', error.stack);
    }
  }
}

checkExistingTables();