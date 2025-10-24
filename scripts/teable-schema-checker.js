#!/usr/bin/env node

// Teable Schema 检查器
// 定期检查字段命名规范和生成注释

const fs = require('fs').promises;
const path = require('path');

// 配置文件路径
const CONFIG_FILE = path.join(__dirname, '../config/teableConfig.js');

// 字段注释映射
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

// 自动识别字段名并生成注释
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

// 检查配置文件
async function checkConfigFile() {
  try {
    await fs.access(CONFIG_FILE);
    console.log('✅ 配置文件存在');
    return true;
  } catch (error) {
    console.error('❌ 配置文件不存在:', CONFIG_FILE);
    return false;
  }
}

// 主执行流程
async function run() {
  console.log('🔍 Teable Schema 检查器启动');
  
  // 检查配置文件
  const configExists = await checkConfigFile();
  if (!configExists) {
    console.log('请确保配置文件存在后再运行检查器');
    process.exit(1);
  }
  
  // 模拟检查一些常见字段
  const commonFields = [
    'fund_code',
    'user_id',
    'created_at',
    'navHistory',  // 不规范命名示例
    'users 2',     // 不规范命名示例
    'permission_key'
  ];
  
  console.log('\n📋 字段命名规范检查:');
  let issuesFound = false;
  
  commonFields.forEach(field => {
    const issues = checkFieldNaming(field);
    if (issues.length > 0) {
      issuesFound = true;
      const suggestion = suggestRename(field);
      console.log(`❌ ${field}: ${issues.join(', ')} → 建议: ${suggestion}`);
    } else {
      console.log(`✅ ${field}: 符合命名规范`);
    }
  });
  
  if (!issuesFound) {
    console.log('  所有检查的字段命名均符合规范');
  }
  
  console.log('\n📝 字段注释生成示例:');
  commonFields.forEach(field => {
    const comment = generateCommentFromFieldName(field);
    console.log(`  ${field}: ${comment}`);
  });
  
  console.log('\n✅ Teable Schema 检查完成');
}

// 如果直接运行此脚本
if (require.main === module) {
  run().catch(console.error);
}

module.exports = {
  checkFieldNaming,
  suggestRename,
  generateCommentFromFieldName
};