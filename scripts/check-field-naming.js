const axios = require('axios');

// 从环境变量获取配置
const apiBase = process.env.TEABLE_API_BASE || 'https://app.teable.cn';
const baseId = process.env.TEABLE_BASE_ID || 'bsesJG9zTxCFYUdcNyV';
const apiToken = process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=';

// 命名规范检查规则
const namingRules = {
  snake_case: /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/,  // 小写蛇形命名
  no_spaces: /^[^\s]*$/,  // 不能包含空格
  no_numbers_suffix: /^[^0-9]*[^0-9]$/,  // 不能以数字结尾
  semantic: /^[a-z][a-zA-Z0-9_]*$/  // 语义清晰
};

// 建议重命名的映射
const renameSuggestions = {
  'users 2': 'users_archive',
  'funds 2': 'funds_backup',
  'navHistory': 'nav_history',
  'createdAt': 'created_at',
  'updatedAt': 'updated_at',
  'userID': 'user_id',
  'fundID': 'fund_id',
  'roleID': 'role_id',
  'permissionID': 'permission_id'
};

// 检查字段命名是否符合规范
function checkFieldNaming(fieldName) {
  const issues = [];
  
  // 检查蛇形命名
  if (!namingRules.snake_case.test(fieldName)) {
    issues.push('不符合蛇形命名规范');
  }
  
  // 检查空格
  if (!namingRules.no_spaces.test(fieldName)) {
    issues.push('包含空格');
  }
  
  // 检查数字后缀
  if (!namingRules.no_numbers_suffix.test(fieldName)) {
    issues.push('以数字结尾');
  }
  
  // 检查语义清晰性
  if (!namingRules.semantic.test(fieldName)) {
    issues.push('命名不够语义化');
  }
  
  return issues;
}

// 生成重命名建议
function suggestRename(fieldName) {
  // 如果在建议映射中，直接返回
  if (renameSuggestions[fieldName]) {
    return renameSuggestions[fieldName];
  }
  
  // 自动转换为蛇形命名
  let suggestion = fieldName;
  
  // 处理空格
  suggestion = suggestion.replace(/\s+/g, '_');
  
  // 处理驼峰命名
  suggestion = suggestion.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  
  // 处理数字后缀
  suggestion = suggestion.replace(/\s*(\d+)$/, '_v$1');
  
  return suggestion;
}

console.log('字段命名规范检查器');
console.log('API Base:', apiBase);
console.log('Base ID:', baseId);

// 示例：检查现有表的字段命名
const existingFields = [
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
  'update_time',
  'users 2',
  'funds 2',
  'navHistory',
  'createdAt',
  'updatedAt'
];

console.log('\n=== 字段命名规范检查 ===');
existingFields.forEach(field => {
  const issues = checkFieldNaming(field);
  if (issues.length > 0) {
    const suggestion = suggestRename(field);
    console.log(`❌ ${field}: ${issues.join(', ')} → 建议重命名为: ${suggestion}`);
  } else {
    console.log(`✅ ${field}: 符合命名规范`);
  }
});

console.log('\n=== 重命名建议汇总 ===');
const fieldsNeedingRename = existingFields.filter(field => checkFieldNaming(field).length > 0);
if (fieldsNeedingRename.length > 0) {
  fieldsNeedingRename.forEach(field => {
    const suggestion = suggestRename(field);
    console.log(`${field} → ${suggestion}`);
  });
} else {
  console.log('所有字段命名均符合规范');
}

console.log('\n✅ 命名规范检查完成');