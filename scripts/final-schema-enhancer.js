#!/usr/bin/env node

// 基于已知字段信息的Teable Schema增强器
// 由于Teable API限制，我们使用预定义的字段信息

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

// 预定义的表和字段信息
const tableSchema = {
  funds: {
    id: 'tblNrHE1BPVDXZZ92uf',
    name: 'funds',
    description: '基金基本信息表',
    fields: [
      { id: 'fld1', name: 'fund_code', type: 'SingleLineText' },
      { id: 'fld2', name: 'fund_name', type: 'SingleLineText' },
      { id: 'fld3', name: 'net_value', type: 'Number' },
      { id: 'fld4', name: 'date', type: 'Date' },
      { id: 'fld5', name: 'fund_manager', type: 'SingleLineText' },
      { id: 'fld6', name: 'risk_level', type: 'SingleSelect' },
      { id: 'fld7', name: 'min_investment', type: 'Number' },
      { id: 'fld8', name: 'management_fee', type: 'Number' },
      { id: 'fld9', name: 'performance_fee', type: 'Number' },
      { id: 'fld10', name: 'total_return', type: 'Number' }
    ]
  },
  users: {
    id: 'tblJ5KsNs94ZkEJfnEy',
    name: 'users',
    description: '系统用户表',
    fields: [
      { id: 'fld1', name: 'user_id', type: 'SingleLineText' },
      { id: 'fld2', name: 'username', type: 'SingleLineText' },
      { id: 'fld3', name: 'email', type: 'Email' },
      { id: 'fld4', name: 'password', type: 'SingleLineText' },
      { id: 'fld5', name: 'role', type: 'SingleLineText' },
      { id: 'fld6', name: 'created_at', type: 'Date' },
      { id: 'fld7', name: 'updated_at', type: 'Date' }
    ]
  },
  roles: {
    id: 'tblb8pqrqWB046vy5YQ',
    name: 'roles',
    description: '系统角色定义表',
    fields: [
      { id: 'fld1', name: 'role_id', type: 'SingleLineText' },
      { id: 'fld2', name: 'role_name', type: 'SingleLineText' },
      { id: 'fld3', name: 'description', type: 'LongText' },
      { id: 'fld4', name: 'permissions', type: 'MultipleSelect' }
    ]
  },
  permissions: {
    id: 'tblbHsLGOlTT0ftSzw3',
    name: 'permissions',
    description: '权限配置表',
    fields: [
      { id: 'fld1', name: 'permission_id', type: 'SingleLineText' },
      { id: 'fld2', name: 'permission_key', type: 'SingleLineText' },
      { id: 'fld3', name: 'permission_name', type: 'SingleLineText' },
      { id: 'fld4', name: 'resource', type: 'SingleLineText' },
      { id: 'fld5', name: 'action', type: 'SingleLineText' }
    ]
  },
  fund_net_value: {
    id: 'tblSgTXOxgltRh32w6q',
    name: 'fund_net_value',
    description: '基金净值历史数据',
    fields: [
      { id: 'fld1', name: 'fund_code', type: 'SingleLineText' },
      { id: 'fld2', name: 'date', type: 'Date' },
      { id: 'fld3', name: 'nav', type: 'Number' },
      { id: 'fld4', name: 'created_at', type: 'Date' }
    ]
  }
};

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

// 生成字段注释
function mapComments(fields) {
  return fields.map(field => {
    const comment = fieldCommentMap[field.name] || generateCommentFromFieldName(field.name);
    return {
      ...field,
      comment: comment
    };
  });
}

// 检查字段命名规范
function checkNaming(fields) {
  return fields.map(field => {
    const issues = checkFieldNaming(field.name);
    const suggestion = suggestRename(field.name);
    return {
      ...field,
      issues: issues,
      suggestion: suggestion
    };
  });
}

// 主执行流程
async function run() {
  console.log('🚀 Teable Schema 增强器启动');
  
  // 处理每个表
  for (const tableName in tableSchema) {
    const table = tableSchema[tableName];
    console.log(`\n📋 处理表: ${table.name} (${table.id})`);
    console.log(`  描述: ${table.description}`);
    
    // 1. 生成注释
    const fieldsWithComments = mapComments(table.fields);
    
    // 2. 检查命名规范
    const fieldsWithNamingCheck = checkNaming(table.fields);
    const fieldsNeedingRename = fieldsWithNamingCheck.filter(f => f.issues.length > 0);
    
    // 3. 显示字段注释
    console.log(`\n📝 字段注释:`);
    fieldsWithComments.forEach(field => {
      console.log(`  - ${field.name}: ${field.comment}`);
    });
    
    // 4. 显示命名规范检查结果
    if (fieldsNeedingRename.length > 0) {
      console.log(`\n⚠️  命名规范检查:`);
      fieldsNeedingRename.forEach(field => {
        console.log(`  - ${field.name}: ${field.issues.join(', ')} → 建议: ${field.suggestion}`);
      });
    } else {
      console.log(`\n✅ 所有字段命名均符合规范`);
    }
  }
  
  // 生成重命名建议汇总
  console.log(`\n📊 重命名建议汇总:`);
  const allFields = [];
  for (const tableName in tableSchema) {
    allFields.push(...tableSchema[tableName].fields);
  }
  
  const fieldsNeedingRename = allFields.filter(field => checkFieldNaming(field.name).length > 0);
  if (fieldsNeedingRename.length > 0) {
    fieldsNeedingRename.forEach(field => {
      const suggestion = suggestRename(field.name);
      console.log(`  ${field.name} → ${suggestion}`);
    });
  } else {
    console.log(`  所有字段命名均符合规范，无需重命名`);
  }
  
  console.log('\n🎉 Teable Schema 增强完成！');
}

// 执行增强器
run().catch(console.error);