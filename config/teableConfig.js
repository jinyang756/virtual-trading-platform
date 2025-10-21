module.exports = {
  // Teable数据库配置 - 支持环境变量覆盖
  teable: {
    apiBase: process.env.TEABLE_API_BASE || 'https://teable.io',
    baseId: process.env.TEABLE_BASE_ID || 'accBtf7wmWSWmxEmTbc_Lt4EeDps',
    apiToken: process.env.TEABLE_API_TOKEN || 'teable_accIL96c04fYcrQfecD_uVPFoJqEXcKmAjbRLUA1BpubL0rgHvmvxDgwHDtdYeA=',
    // 表ID映射（初始为空，创建表后会更新）
    tables: {
      // 管理后台核心表
      users: '',
      roles: '',
      permissions: '',
      logs: '',
      
      // 业务表
      transactions: '',
      positions: '',
      contractOrders: '',
      binaryOrders: '',
      fundTransactions: '',
      fundPositions: '',
      workflows: '',
      workflowTasks: ''
    }
  }
};