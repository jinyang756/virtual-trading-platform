const { executeQuery } = require('../database/connection');

class Role {
  constructor(id, name, description, permissions = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.permissions = permissions; // 权限数组
  }

  // 保存角色到数据库
  async save() {
    const query = `
      INSERT INTO roles (id, name, description, permissions)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.name,
      this.description,
      JSON.stringify(this.permissions)
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找角色
  static async findById(id) {
    const query = 'SELECT * FROM roles WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      if (results.length > 0) {
        const role = results[0];
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
    const query = 'SELECT * FROM roles WHERE name = ?';
    
    try {
      const results = await executeQuery(query, [name]);
      if (results.length > 0) {
        const role = results[0];
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
    const query = 'SELECT * FROM roles';
    
    try {
      const results = await executeQuery(query);
      return results.map(role => {
        role.permissions = JSON.parse(role.permissions);
        return role;
      });
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
      
      const query = 'UPDATE roles SET permissions = ? WHERE id = ?';
      const values = [JSON.stringify(role.permissions), roleId];
      
      try {
        await executeQuery(query, values);
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
      
      const query = 'UPDATE roles SET permissions = ? WHERE id = ?';
      const values = [JSON.stringify(role.permissions), roleId];
      
      try {
        await executeQuery(query, values);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
    
    return { success: true };
  }
}

module.exports = Role;