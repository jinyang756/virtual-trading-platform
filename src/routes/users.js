const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, requireAdmin } = require('../middleware/authorization');
const { authenticate, authenticateAdmin } = require('../middleware/auth');

// 公开接口
router.post('/register', userController.register);
router.post('/login', userController.login);

// 受保护的接口
router.get('/:id', authenticateJWT, userController.getUser);
router.put('/:id', authenticateJWT, userController.updateUser);
router.delete('/:id', authenticateJWT, userController.deleteUser);
router.get('/:id/permissions', authenticateJWT, userController.getUserPermissions);

// 管理员接口
router.get('/', authenticateJWT, userController.getAllUsers);

module.exports = router;