const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
const { authenticateAdmin } = require('../middleware/auth');

// 管理员登录
router.post('/login', configController.adminLogin);

// 获取所有用户
router.get('/users', authenticateAdmin, configController.getAllUsers);

// 删除用户
router.delete('/users/:id', authenticateAdmin, configController.deleteUser);

// 获取系统配置
router.get('/config', authenticateAdmin, configController.getSystemConfig);

// 更新系统配置
router.put('/config', authenticateAdmin, configController.updateSystemConfig);

// 数据备份
router.post('/backup', authenticateAdmin, configController.backupData);

// 列出备份
router.get('/backups', authenticateAdmin, configController.listBackups);

// 恢复备份
router.post('/restore', authenticateAdmin, configController.restoreBackup);

// 清理日志
router.post('/clear-logs', authenticateAdmin, configController.clearLogs);

// 重启服务
router.post('/restart', authenticateAdmin, configController.restartServer);

module.exports = router;