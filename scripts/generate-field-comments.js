const axios = require('axios');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
const baseId = process.env.TEABLE_BASE_ID || 'bsesJG9zTxCFYUdcNyV';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';

// 字段名到中文注释的映射
const fieldCommentMap = {
  // 基金相关字段
  'fund_code': '基金代码',
  'fund_name': '基金名称',
  'net_value': '当前净值',
  'date': '净值日期',
  'nav': '净值',
  'nav_history': '净值历史',
  'fund_manager': '基金经理',
  'risk_level': '风险等级',
  'min_investment': '最低投资金额',
  'management_fee': '管理费',
  'performance_fee': '业绩报酬',
  'total_return': '总回报',
  'update_time': '更新时间',
  
  // 用户相关字段
  'user_id': '用户ID',
  'username': '用户名',
  'email': '邮箱',
  'password': '密码',
  'role': '角色',
  'created_at': '创建时间',
  'updated_at': '更新时间',
  
  // 角色相关字段
  'role_id': '角色ID',
  'role_name': '角色名称',
  'description': '描述',
  'permissions': '权限列表',
  
  // 权限相关字段
  'permission_id': '权限ID',
  'permission_key': '权限标识',
  'permission_name': '权限名称',
  'resource': '资源',
  'action': '操作',
  
  // 交易相关字段
  'transaction_id': '交易ID',
  'type': '交易类型',
  'symbol': '交易标的',
  'quantity': '数量',
  'price': '价格',
  'amount': '金额',
  'fee': '手续费',
  'status': '状态',
  
  // 持仓相关字段
  'position_id': '持仓ID',
  'average_price': '平均成本',
  'current_price': '当前价格',
  'market_value': '市值',
  'profit_loss': '盈亏',
  'shares': '份额',
  
  // 通用字段
  'id': '主键ID',
  'name': '名称',
  'value': '值',
  'content': '内容',
  'details': '详情',
  'notes': '备注',
  'remark': '备注',
  'is_active': '是否激活',
  'is_deleted': '是否删除',
  'sort_order': '排序',
  'version': '版本'
};

// 自动识别字段名并生成注释的函数
function generateCommentFromFieldName(fieldName) {
  // 如果在映射中直接返回
  if (fieldCommentMap[fieldName]) {
    return fieldCommentMap[fieldName];
  }
  
  // 处理下划线分隔的字段名
  if (fieldName.includes('_')) {
    const parts = fieldName.split('_');
    const commentParts = parts.map(part => {
      return fieldCommentMap[part] || part;
    });
    return commentParts.join('');
  }
  
  // 处理驼峰命名
  if (/[a-z][A-Z]/.test(fieldName)) {
    const camelParts = fieldName.split(/(?=[A-Z])/);
    const commentParts = camelParts.map(part => {
      const lowerPart = part.toLowerCase();
      return fieldCommentMap[lowerPart] || part;
    });
    return commentParts.join('');
  }
  
  // 默认返回字段名
  return fieldName;
}

console.log('字段注释生成器');
console.log('API Base:', apiBase);
console.log('Base ID:', baseId);

// 示例：为funds表生成字段注释
const fundsTableFields = [
  'fund_code',
  'fund_name',
  'net_value',
  'date',
  'fund_manager',
  'risk_level',
  'min_investment',
  'management_fee',
  'performance_fee',
  'total_return',
  'update_time'
];

console.log('\n=== funds表字段注释 ===');
fundsTableFields.forEach(field => {
  const comment = generateCommentFromFieldName(field);
  console.log(`${field}: ${comment}`);
});

// 示例：为users表生成字段注释
const usersTableFields = [
  'user_id',
  'username',
  'email',
  'password',
  'role',
  'created_at',
  'updated_at'
];

console.log('\n=== users表字段注释 ===');
usersTableFields.forEach(field => {
  const comment = generateCommentFromFieldName(field);
  console.log(`${field}: ${comment}`);
});

console.log('\n✅ 字段注释生成完成');