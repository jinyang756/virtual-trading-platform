const dbAdapter = require('../database/dbAdapter');
const logger = require('../utils/logger');
const { generateId } = require('../utils/codeGenerator');

/**
 * 工作流状态枚举
 */
const WorkflowStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * 创建新的工作流
 */
exports.createWorkflow = async (req, res) => {
  try {
    const { name, description, workflowType, config } = req.body;
    const userId = req.user?.id;

    // 验证参数
    if (!name || !workflowType) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: name, workflowType'
      });
    }

    const workflowId = generateId();
    const createdAt = new Date();

    // 插入工作流记录
    await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'insert',
      data: {
        id: workflowId,
        name: name,
        description: description,
        type: workflowType,
        config: JSON.stringify(config || {}),
        status: WorkflowStatus.PENDING,
        created_by: userId,
        created_at: createdAt,
        updated_at: createdAt
      }
    });

    // 创建初始任务
    const taskId = generateId();
    await dbAdapter.executeQuery({
      table: 'workflow_tasks',
      operation: 'insert',
      data: {
        id: taskId,
        workflow_id: workflowId,
        name: '初始化任务',
        status: WorkflowStatus.PENDING,
        created_at: createdAt,
        updated_at: createdAt
      }
    });

    res.status(201).json({
      success: true,
      message: '工作流创建成功',
      data: {
        id: workflowId,
        name,
        description,
        workflowType,
        status: WorkflowStatus.PENDING,
        createdBy: userId,
        createdAt
      }
    });
  } catch (error) {
    logger.error('创建工作流失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      body: req.body
    });

    res.status(500).json({
      success: false,
      message: '创建工作流失败',
      error: error.message
    });
  }
};

/**
 * 获取工作流列表
 */
exports.getWorkflows = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // 构建查询参数
    let filter = '1=1';
    const params = {};

    if (status) {
      filter += ` AND status = '${status}'`;
    }

    if (type) {
      filter += ` AND type = '${type}'`;
    }

    // 获取工作流列表
    const result = await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'select',
      params: {
        filter: filter,
        sort: [{ field: 'created_at', order: 'desc' }],
        take: parseInt(limit),
        skip: parseInt(offset)
      }
    });

    const workflows = result.records ? result.records.map(record => record.fields) : [];

    // 获取总数
    const countResult = await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'select',
      params: {
        filter: filter
      }
    });

    const totalCount = countResult.records ? countResult.records.length : 0;

    res.json({
      success: true,
      data: {
        workflows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalCount,
          totalPages: Math.ceil(totalCount / limit)
        }
      }
    });
  } catch (error) {
    logger.error('获取工作流列表失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      query: req.query
    });

    res.status(500).json({
      success: false,
      message: '获取工作流列表失败',
      error: error.message
    });
  }
};

/**
 * 获取工作流详情
 */
exports.getWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;

    // 获取工作流基本信息
    const workflowResult = await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'select',
      params: {
        filter: `id = '${id}'`
      }
    });
    
    if (!workflowResult.records || workflowResult.records.length === 0) {
      return res.status(404).json({
        success: false,
        message: '工作流不存在'
      });
    }

    const workflow = workflowResult.records[0].fields;

    // 获取工作流任务列表
    const tasksResult = await dbAdapter.executeQuery({
      table: 'workflow_tasks',
      operation: 'select',
      params: {
        filter: `workflow_id = '${id}'`,
        sort: [{ field: 'created_at', order: 'asc' }]
      }
    });

    const tasks = tasksResult.records ? tasksResult.records.map(record => record.fields) : [];

    res.json({
      success: true,
      data: {
        workflow,
        tasks
      }
    });
  } catch (error) {
    logger.error('获取工作流详情失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      params: req.params
    });

    res.status(500).json({
      success: false,
      message: '获取工作流详情失败',
      error: error.message
    });
  }
};

/**
 * 启动工作流
 */
exports.startWorkflow = async (req, res) => {
  try {
    const { id } = req.params;

    // 检查工作流是否存在且状态为pending
    const workflowResult = await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'select',
      params: {
        filter: `id = '${id}' AND status = '${WorkflowStatus.PENDING}'`
      }
    });

    if (!workflowResult.records || workflowResult.records.length === 0) {
      return res.status(400).json({
        success: false,
        message: '工作流不存在或状态不正确'
      });
    }

    const updatedAt = new Date();

    // 更新工作流状态为running
    await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'update',
      recordId: id,
      data: {
        status: WorkflowStatus.RUNNING,
        updated_at: updatedAt
      }
    });

    // 更新所有任务状态为pending
    await dbAdapter.executeQuery({
      table: 'workflow_tasks',
      operation: 'update',
      recordId: id,
      data: {
        status: WorkflowStatus.PENDING,
        updated_at: updatedAt
      }
    });

    res.json({
      success: true,
      message: '工作流启动成功',
      data: {
        id,
        status: WorkflowStatus.RUNNING,
        updatedAt
      }
    });
  } catch (error) {
    logger.error('启动工作流失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      params: req.params
    });

    res.status(500).json({
      success: false,
      message: '启动工作流失败',
      error: error.message
    });
  }
};

/**
 * 更新工作流任务状态
 */
exports.updateTaskStatus = async (req, res) => {
  try {
    const { workflowId, taskId } = req.params;
    const { status, result } = req.body;

    // 验证状态
    if (!Object.values(WorkflowStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: '无效的任务状态'
      });
    }

    const updatedAt = new Date();

    // 更新任务状态
    await dbAdapter.executeQuery({
      table: 'workflow_tasks',
      operation: 'update',
      recordId: taskId,
      data: {
        status: status,
        result: JSON.stringify(result || {}),
        updated_at: updatedAt
      }
    });

    // 检查是否所有任务都已完成
    const pendingTasksResult = await dbAdapter.executeQuery({
      table: 'workflow_tasks',
      operation: 'select',
      params: {
        filter: `workflow_id = '${workflowId}' AND status != '${WorkflowStatus.COMPLETED}'`
      }
    });

    const pendingTasksCount = pendingTasksResult.records ? pendingTasksResult.records.length : 0;

    // 如果所有任务都已完成，更新工作流状态
    if (pendingTasksCount === 0) {
      await dbAdapter.executeQuery({
        table: 'workflows',
        operation: 'update',
        recordId: workflowId,
        data: {
          status: WorkflowStatus.COMPLETED,
          updated_at: updatedAt
        }
      });
    }

    res.json({
      success: true,
      message: '任务状态更新成功',
      data: {
        taskId,
        status,
        updatedAt
      }
    });
  } catch (error) {
    logger.error('更新任务状态失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      params: req.params,
      body: req.body
    });

    res.status(500).json({
      success: false,
      message: '更新任务状态失败',
      error: error.message
    });
  }
};

/**
 * 取消工作流
 */
exports.cancelWorkflow = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAt = new Date();

    // 更新工作流状态为cancelled
    await dbAdapter.executeQuery({
      table: 'workflows',
      operation: 'update',
      recordId: id,
      data: {
        status: WorkflowStatus.CANCELLED,
        updated_at: updatedAt
      }
    });

    // 更新所有未完成任务状态为cancelled
    await dbAdapter.executeQuery({
      table: 'workflow_tasks',
      operation: 'update',
      recordId: id,
      data: {
        status: WorkflowStatus.CANCELLED,
        updated_at: updatedAt
      }
    });

    res.json({
      success: true,
      message: '工作流取消成功',
      data: {
        id,
        status: WorkflowStatus.CANCELLED,
        updatedAt
      }
    });
  } catch (error) {
    logger.error('取消工作流失败', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.id,
      params: req.params
    });

    res.status(500).json({
      success: false,
      message: '取消工作流失败',
      error: error.message
    });
  }
};