/**
 * 工作流路由
 */

const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');

// 创建新的工作流
router.post('/', workflowController.createWorkflow);

// 获取工作流列表
router.get('/', workflowController.getWorkflows);

// 获取工作流详情
router.get('/:id', workflowController.getWorkflowById);

// 启动工作流
router.post('/:id/start', workflowController.startWorkflow);

// 更新任务状态
router.put('/:workflowId/tasks/:taskId', workflowController.updateTaskStatus);

// 取消工作流
router.post('/:id/cancel', workflowController.cancelWorkflow);

module.exports = router;