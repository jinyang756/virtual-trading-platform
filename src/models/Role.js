const dbAdapter = require('../database/dbAdapter');

class Role {
  constructor(id, name, description, permissions = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.permissions = permissions; // 权限数组
  }

  // 保存角色到数据库
  async save() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'roles',
        operation: 'insert',
        data: {
          id: this.id,
          name: this.name,
          description: this.description,
          permissions: JSON.stringify(this.permissions)
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找角色
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'roles',
        operation: 'select',
        params: {
          filter: `id = '${id}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const role = result.records[0].fields;
        role.permissions = JSON.parse(role.permissions);
        return role;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // 根据名称查找角色
  static async findByName(name) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'roles',
        operation: 'select',
        params: {
          filter: `name = '${name}'`
        }
      });
      
      if (result.records && result.records.length > 0) {
        const role = result.records[0].fields;
        role.permissions = JSON.parse(role.permissions);
        return role;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  // 获取所有角色
  static async findAll() {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'roles',
        operation: 'select'
      });
      
      return result.records ? result.records.map(record => {
        const role = record.fields;
        role.permissions = JSON.parse(role.permissions);
        return role;
      }) : [];
    } catch (error) {
      throw error;
    }
  }

  // 检查角色是否具有特定权限
  static async hasPermission(roleId, permission) {
    const role = await this.findById(roleId);
    if (!role) return false;
    
    return role.permissions.includes(permission);
  }

  // 为角色添加权限
  static async addPermission(roleId, permission) {
    const role = await this.findById(roleId);
    if (!role) return { success: false, error: '角色不存在' };
    
    if (!role.permissions.includes(permission)) {
      role.permissions.push(permission);
      
      try {
        const result = await dbAdapter.executeQuery({
          table: 'roles',
          operation: 'update',
          recordId: roleId,
          data: {
            permissions: JSON.stringify(role.permissions)
          }
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    
    return { success: true };
  }

  // 为角色移除权限
  static async removePermission(roleId, permission) {
    const role = await this.findById(roleId);
    if (!role) return { success: false, error: '角色不存在' };
    
    const index = role.permissions.indexOf(permission);
    if (index > -1) {
      role.permissions.splice(index, 1);
      
      try {
        const result = await dbAdapter.executeQuery({
          table: 'roles',
          operation: 'update',
          recordId: roleId,
          data: {
            permissions: JSON.stringify(role.permissions)
          }
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    
    return { success: true };
  }
}

module.exports = Role;