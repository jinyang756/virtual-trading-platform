const dbAdapter = require('../database/dbAdapter');
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
    try {
      const result = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'insert',
        data: {
          id: this.id,
          username: this.username,
          email: this.email,
          password_hash: this.passwordHash,
          balance: this.balance,
          role_id: this.roleId,
          two_factor_secret: this.two_factor_secret,
          two_factor_enabled: this.two_factor_enabled,
          ip_whitelist: this.ip_whitelist,
          kyc_status: this.kyc_status,
          data_privacy_consent: this.data_privacy_consent,
          created_at: this.createdAt
        }
      });
      return { success: true, id: this.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 根据ID查找用户
  static async findById(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'select',
        params: {
          filter: `id = '${id}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据用户名查找用户
  static async findByUsername(username) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'select',
        params: {
          filter: `username = '${username}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields : null;
    } catch (error) {
      throw error;
    }
  }

  // 根据邮箱查找用户
  static async findByEmail(email) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'select',
        params: {
          filter: `email = '${email}'`
        }
      });
      
      return result.records && result.records.length > 0 ? result.records[0].fields : null;
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
    const updateData = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // 转换字段名格式
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        updateData[dbField] = value;
      }
    }
    
    if (Object.keys(updateData).length === 0) {
      throw new Error('没有有效的更新字段');
    }
    
    try {
      const result = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'update',
        recordId: id,
        data: updateData
      });
      
      return result !== null ? await this.findById(id) : null;
    } catch (error) {
      throw error;
    }
  }

  // 删除用户
  static async delete(id) {
    try {
      const result = await dbAdapter.executeQuery({
        table: 'users',
        operation: 'delete',
        recordId: id
      });
      
      return result !== null;
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