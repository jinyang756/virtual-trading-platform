const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');
const bcrypt = require('bcrypt');
const Role = require('./Role');

class User {
  constructor(id, username, email, passwordHash, balance = 100000, roleId = null) {
    this.id = id || generateId();
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.balance = balance;
    this.roleId = roleId || 'user'; // 默认角色为普通用户
    this.createdAt = new Date();
  }

  // 保存用户到数据库
  async save() {
    const query = `
      INSERT INTO users (id, username, email, password_hash, balance, role_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.username,
      this.email,
      this.passwordHash,
      this.balance,
      this.roleId,
      this.createdAt
    ];

    try {
      const result = await executeQuery(query, values);
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找用户
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    
    try {
      const results = await executeQuery(query, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户名查找用户
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    
    try {
      const results = await executeQuery(query, [username]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    try {
      const results = await executeQuery(query, [email]);
      return results.length > 0 ? results[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // 验证密码
  static async validatePassword(username, password) {
    try {
      const user = await this.findByUsername(username);
      if (!user) return false;
      
      // 使用bcrypt比较密码哈希
      return await bcrypt.compare(password, user.password_hash);
    } catch (error) {
      console.error('密码验证错误:', error.message);
      return false;
    }
  }

  // 更新用户信息
  static async update(id, updates) {
    const allowedFields = ['username', 'email', 'balance', 'role_id'];
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }
    
    if (fields.length === 0) {
      throw new Error('没有有效的更新字段');
    }
    
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
      const result = await executeQuery(query, values);
      return result.affectedRows > 0 ? await this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }

  // 删除用户
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    
    try {
      const result = await executeQuery(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // 获取用户角色
  async getRole() {
    return await Role.findById(this.roleId);
  }

  // 检查用户是否具有特定权限
  async hasPermission(permission) {
    const role = await this.getRole();
    if (!role) return false;
    
    return role.permissions.includes(permission);
  }

  // 获取用户所有权限
  async getPermissions() {
    const role = await this.getRole();
    if (!role) return [];
    
    return role.permissions;
  }
}

module.exports = User;