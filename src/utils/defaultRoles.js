const Role = require('../models/Role');
const { generateId } = require('./codeGenerator');

// 默认角色定义
const defaultRoles = [
  {
    id: 'admin',
    name: 'admin',
    description: '系统管理员',
    permissions: [
      'user.manage',
      'user.delete',
      'user.view',
      'user.update',
      'trade.execute',
      'trade.view',
      'trade.cancel',
      'fund.subscribe',
      'fund.redeem',
      'system.config',
      'system.backup',
      'system.restore'
    ]
  },
  {
    id: 'user',
    name: 'user',
    description: '普通用户',
    permissions: [
      'trade.execute',
      'trade.view',
      'trade.cancel',
      'fund.subscribe',
      'fund.redeem',
      'user.view',
      'user.update'
    ]
  },
  {
    id: 'guest',
    name: 'guest',
    description: '访客用户',
    permissions: [
      'trade.view',
      'market.view'
    ]
  }
];

// 初始化默认角色
async function initializeDefaultRoles() {
  console.log('正在初始化默认角色...');
  
  for (const roleData of defaultRoles) {
    try {
      // 检查角色是否已存在
      const existingRole = await Role.findByName(roleData.name);
      if (!existingRole) {
        // 创建新角色
        const role = new Role(
          roleData.id,
          roleData.name,
          roleData.description,
          roleData.permissions
        );
        await role.save();
        console.log(`角色 "${roleData.name}" 创建成功`);
      } else {
        console.log(`角色 "${roleData.name}" 已存在`);
      }
    } catch (error) {
      console.error(`创建角色 "${roleData.name}" 失败:`, error.message);
    }
  }
  
  console.log('默认角色初始化完成');
}

module.exports = {
  defaultRoles,
  initializeDefaultRoles
};