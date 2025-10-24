#!/usr/bin/env node

/**
 * 权限系统初始化脚本
 * 基于RBAC模型初始化角色、权限和角色权限映射
 */

const teableClient = require('../src/database/teableClient');

// 角色定义
const roles = [
  { id: "admin", name: "管理员", desc: "系统全权管理" },
  { id: "operator", name: "运营人员", desc: "查看数据与报表" },
  { id: "investor", name: "投资者", desc: "查看基金信息" }
];

// 权限定义
const permissions = [
  { id: "view_fund", name: "查看基金", action: "GET /api/fund" },
  { id: "edit_fund", name: "编辑基金", action: "PUT /api/fund/:id" },
  { id: "export_report", name: "导出报表", action: "GET /api/report/export" },
  { id: "manage_users", name: "管理用户", action: "POST /api/user" },
  { id: "view_contract", name: "查看合约", action: "GET /api/contract" },
  { id: "trade_contract", name: "交易合约", action: "POST /api/contract/order" },
  { id: "view_option", name: "查看期权", action: "GET /api/option" },
  { id: "trade_option", name: "交易期权", action: "POST /api/option/order" },
  { id: "view_portfolio", name: "查看投资组合", action: "GET /api/portfolio" },
  { id: "manage_portfolio", name: "管理投资组合", action: "POST /api/portfolio" }
];

// 角色权限映射
const rolePermissions = [
  // 管理员权限
  { role_id: "admin", permission_id: "view_fund" },
  { role_id: "admin", permission_id: "edit_fund" },
  { role_id: "admin", permission_id: "export_report" },
  { role_id: "admin", permission_id: "manage_users" },
  { role_id: "admin", permission_id: "view_contract" },
  { role_id: "admin", permission_id: "trade_contract" },
  { role_id: "admin", permission_id: "view_option" },
  { role_id: "admin", permission_id: "trade_option" },
  { role_id: "admin", permission_id: "view_portfolio" },
  { role_id: "admin", permission_id: "manage_portfolio" },
  
  // 运营人员权限
  { role_id: "operator", permission_id: "view_fund" },
  { role_id: "operator", permission_id: "export_report" },
  { role_id: "operator", permission_id: "view_contract" },
  { role_id: "operator", permission_id: "view_option" },
  { role_id: "operator", permission_id: "view_portfolio" },
  
  // 投资者权限
  { role_id: "investor", permission_id: "view_fund" },
  { role_id: "investor", permission_id: "view_contract" },
  { role_id: "investor", permission_id: "view_option" },
  { role_id: "investor", permission_id: "view_portfolio" }
];

/**
 * 初始化角色表
 */
async function initRoles() {
  console.log('👤 初始化角色表...');
  
  try {
    // 批量创建角色
    const roleRecords = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.desc
    }));
    
    await teableClient.createRecords('roles', roleRecords);
    console.log('✅ 角色表初始化完成');
  } catch (error) {
    console.error('❌ 角色表初始化失败:', error.message);
    throw error;
  }
}

/**
 * 初始化权限表
 */
async function initPermissions() {
  console.log('🔑 初始化权限表...');
  
  try {
    // 批量创建权限
    const permissionRecords = permissions.map(perm => ({
      id: perm.id,
      name: perm.name,
      action: perm.action
    }));
    
    await teableClient.createRecords('permissions', permissionRecords);
    console.log('✅ 权限表初始化完成');
  } catch (error) {
    console.error('❌ 权限表初始化失败:', error.message);
    throw error;
  }
}

/**
 * 初始化角色权限映射表
 */
async function initRolePermissions() {
  console.log('🔗 初始化角色权限映射表...');
  
  try {
    // 批量创建角色权限映射
    const rolePermissionRecords = rolePermissions.map(rp => ({
      role_id: rp.role_id,
      permission_id: rp.permission_id
    }));
    
    await teableClient.createRecords('role_permissions', rolePermissionRecords);
    console.log('✅ 角色权限映射表初始化完成');
  } catch (error) {
    console.error('❌ 角色权限映射表初始化失败:', error.message);
    throw error;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始初始化权限系统...');
  
  try {
    // 初始化角色表
    await initRoles();
    
    // 初始化权限表
    await initPermissions();
    
    // 初始化角色权限映射表
    await initRolePermissions();
    
    console.log('\n🎉 权限系统初始化完成！');
    console.log('已创建以下角色:');
    roles.forEach(role => {
      console.log(`  - ${role.name} (${role.id}): ${role.desc}`);
    });
    
    console.log('\n已创建以下权限:');
    permissions.forEach(perm => {
      console.log(`  - ${perm.name} (${perm.id}): ${perm.action}`);
    });
    
  } catch (error) {
    console.error('\n❌ 权限系统初始化失败:', error.message);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main();
}

module.exports = {
  roles,
  permissions,
  rolePermissions,
  initRoles,
  initPermissions,
  initRolePermissions
};