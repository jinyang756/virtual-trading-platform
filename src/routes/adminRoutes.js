const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Teable数据库管理路由
router.get('/test-connection', adminController.testConnection);
router.get('/tables', adminController.getAllTables);
router.post('/tables', adminController.createTable);
router.get('/records/:tableName', adminController.getTableRecords);
router.post('/records', adminController.createRecord);
router.put('/records', adminController.updateRecord);
router.delete('/records', adminController.deleteRecord);

module.exports = router;