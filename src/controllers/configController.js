const Config = require('../models/Config');
const BackupManager = require('../utils/backupManager');

// 获取配置
exports.getConfig = async (req, res) => {
  try {
    const config = await Config.getAll();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: '获取配置失败', details: error.message });
  }
};

// 更新配置
exports.updateConfig = async (req, res) => {
  try {
    const updates = req.body;
    const updatedConfig = await Config.update(updates);
    res.json({ message: '配置更新成功', config: updatedConfig });
  } catch (error) {
    res.status(500).json({ error: '更新配置失败', details: error.message });
  }
};

// 获取特定配置项
exports.getConfigItem = async (req, res) => {
  try {
    const { key } = req.params;
    const value = await Config.get(key);
    
    if (value === undefined) {
      return res.status(404).json({ error: '配置项不存在' });
    }
    
    res.json({ [key]: value });
  } catch (error) {
    res.status(500).json({ error: '获取配置项失败', details: error.message });
  }
};

// 更新特定配置项
exports.updateConfigItem = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const updatedConfig = await Config.set(key, value);
    res.json({ message: '配置项更新成功', config: updatedConfig });
  } catch (error) {
    res.status(500).json({ error: '更新配置项失败', details: error.message });
  }
};

// 管理员登录
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 这里应该实现管理员身份验证逻辑
    // 为简化起见，我们假设用户名为admin，密码为admin123
    if (username === 'admin' && password === 'admin123') {
      res.json({ message: '管理员登录成功', token: 'admin-token' });
    } else {
      res.status(401).json({ error: '用户名或密码错误' });
    }
  } catch (error) {
    res.status(500).json({ error: '登录失败', details: error.message });
  }
};

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    // 这里应该从用户模型获取所有用户
    // 为简化起见，返回模拟数据
    const users = [
      { id: '1', username: 'admin', email: 'admin@example.com', created_at: '2023-01-01' },
      { id: '2', username: 'user1', email: 'user1@example.com', created_at: '2023-01-02' },
      { id: '3', username: 'user2', email: 'user2@example.com', created_at: '2023-01-03' }
    ];
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: '获取用户列表失败', details: error.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // 这里应该实现删除用户的逻辑
    res.json({ message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除用户失败', details: error.message });
  }
};

// 数据备份
exports.backupData = async (req, res) => {
  try {
    // 创建完整备份
    const backupDir = await BackupManager.createFullBackup();
    
    // 清理7天前的旧备份
    await BackupManager.cleanupOldBackups(7);
    
    res.json({ message: '数据备份成功', backupDir });
  } catch (error) {
    res.status(500).json({ error: '数据备份失败', details: error.message });
  }
};

// 列出备份
exports.listBackups = async (req, res) => {
  try {
    const backups = await BackupManager.listBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: '列出备份失败', details: error.message });
  }
};

// 恢复备份
exports.restoreBackup = async (req, res) => {
  try {
    const { backupName } = req.body;
    
    if (!backupName) {
      return res.status(400).json({ error: '请提供备份名称' });
    }
    
    const backupPath = `backup_${backupName}`;
    await BackupManager.restoreFullBackup(backupPath);
    
    res.json({ message: '备份恢复成功' });
  } catch (error) {
    res.status(500).json({ error: '恢复备份失败', details: error.message });
  }
};

// 清理日志
exports.clearLogs = async (req, res) => {
  try {
    // 这里应该实现清理日志逻辑
    res.json({ message: '日志清理成功' });
  } catch (error) {
    res.status(500).json({ error: '日志清理失败', details: error.message });
  }
};

// 重启服务
exports.restartServer = async (req, res) => {
  try {
    // 这里应该实现重启服务逻辑
    res.json({ message: '服务重启成功' });
  } catch (error) {
    res.status(500).json({ error: '服务重启失败', details: error.message });
  }
};

// 获取系统配置
exports.getSystemConfig = async (req, res) => {
  try {
    const config = await Config.getAll();
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: '获取系统配置失败', details: error.message });
  }
};

// 更新系统配置
exports.updateSystemConfig = async (req, res) => {
  try {
    const updates = req.body;
    const updatedConfig = await Config.update(updates);
    res.json({ message: '系统配置更新成功', config: updatedConfig });
  } catch (error) {
    res.status(500).json({ error: '更新系统配置失败', details: error.message });
  }
};