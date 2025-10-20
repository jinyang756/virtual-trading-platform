const { executeQuery } = require('../database/connection');
const { generateId } = require('../utils/codeGenerator');
const bcrypt = require('bcrypt');
const Role = require('./Role');

class User {
  constructor(id, username, email, passwordHash, balance = 100000, roleId = null, twoFactorSecret = null, twoFactorEnabled = false, ipWhitelist = null, kycStatus = 'pending', dataPrivacyConsent = false) {
    this.id = id || generateId();
    this.username = username;
    this.email = email;
    this.passwordHash = passwordHash;
    this.balance = balance;
    this.roleId = roleId || 'user'; // 默认角色为普通用户
    this.two_factor_secret = twoFactorSecret;
    this.two_factor_enabled = twoFactorEnabled;
    this.ip_whitelist = ipWhitelist;
    this.kyc_status = kycStatus;
    this.data_privacy_consent = dataPrivacyConsent;
    this.createdAt = new Date();
  }

  // 保存用户到数据库
  async save() {
    const query = `
      INSERT INTO users (id, username, email, password_hash, balance, role_id, two_factor_secret, two_factor_enabled, ip_whitelist, kyc_status, data_privacy_consent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      this.id,
      this.username,
      this.email,
      this.passwordHash,
      this.balance,
      this.roleId,
      this.two_factor_secret,
      this.two_factor_enabled,
      this.ip_whitelist,
      this.kyc_status,
      this.data_privacy_consent,
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
    const allowedFields = ['username', 'email', 'balance', 'role_id', 'two_factor_secret', 'two_factor_enabled', 'ip_whitelist', 'kyc_status', 'kyc_verified_at', 'data_privacy_consent', 'data_privacy_consent_at', 'aml_checks', 'last_aml_check'];
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