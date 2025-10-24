/**
 * 权限校验中间件
 * 用于 Express 路由权限控制
 */

const teableClient = require('../database/teableClient');

/**
 * 权限校验中间件
 * @param {string} requiredPermission - 需要的权限ID
 * @returns {function} Express中间件函数
 */
function checkPermission(requiredPermission) {
  return async (req, res, next) => {
    try {
      // 从请求中获取用户信息
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "用户未登录" 
        });
      }
      
      // 获取用户角色
      const userRoles = await getUserRoles(userId);
      
      if (!userRoles || userRoles.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: "用户未分配角色" 
        });
      }
      
      // 获取用户所有权限
      const userPermissions = await getUserPermissions(userRoles);
      
      // 检查是否拥有所需权限
      if (userPermissions.includes(requiredPermission)) {
        return next(); // 权限校验通过
      }
      
      // 权限不足
      return res.status(403).json({ 
        success: false, 
        message: "权限不足" 
      });
      
    } catch (error) {
      console.error('权限校验失败:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: "权限校验异常" 
      });
    }
  };
}

/**
 * 获取用户角色
 * @param {string} userId - 用户ID
 * @returns {Promise<Array>} 用户角色数组
 */
async function getUserRoles(userId) {
  try {
    // 查询用户角色关联表
    const result = await teableClient.getRecords('user_roles', {
      filter: `user_id = "${userId}"`
    });
    
    return result.records.map(record => record.fields.role_id);
  } catch (error) {
    console.error('获取用户角色失败:', error.message);
    throw error;
  }
}

/**
 * 获取用户权限列表
 * @param {Array} roleIds - 用户角色ID数组
 * @returns {Promise<Array>} 用户权限ID数组
 */
async function getUserPermissions(roleIds) {
  try {
    if (!roleIds || roleIds.length === 0) {
      return [];
    }
    
    // 构造查询条件
    const roleConditions = roleIds.map(roleId => `role_id = "${roleId}"`).join(' OR ');
    
    // 查询角色权限关联表
    const result = await teableClient.getRecords('role_permissions', {
      filter: roleConditions
    });
    
    // 提取权限ID并去重
    const permissions = result.records.map(record => record.fields.permission_id);
    return [...new Set(permissions)];
  } catch (error) {
    console.error('获取用户权限失败:', error.message);
    throw error;
  }
}

/**
 * 角色校验中间件
 * @param {string|array} requiredRoles - 需要的角色ID或角色ID数组
 * @returns {function} Express中间件函数
 */
function checkRole(requiredRoles) {
  return async (req, res, next) => {
    try {
      // 从请求中获取用户信息
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ 
          success: false, 
          message: "用户未登录" 
        });
      }
      
      // 获取用户角色
      const userRoles = await getUserRoles(userId);
      
      if (!userRoles || userRoles.length === 0) {
        return res.status(403).json({ 
          success: false, 
          message: "用户未分配角色" 
        });
      }
      
      // 检查是否拥有所需角色
      const requiredRoleArray = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      const hasRequiredRole = requiredRoleArray.some(role => userRoles.includes(role));
      
      if (hasRequiredRole) {
        return next(); // 角色校验通过
      }
      
      // 角色不足
      return res.status(403).json({ 
        success: false, 
        message: "角色权限不足" 
      });
      
    } catch (error) {
      console.error('角色校验失败:', error.message);
      return res.status(500).json({ 
        success: false, 
        message: "角色校验异常" 
      });
    }
  };
}

module.exports = {
  checkPermission,
  checkRole,
  getUserRoles,
  getUserPermissions
};