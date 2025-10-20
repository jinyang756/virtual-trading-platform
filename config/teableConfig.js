module.exports = {
  // Teable数据库配置
  teable: {
    apiBase: 'https://teable.io',
    baseId: 'accBtf7wmWSWmxEmTbc_Lt4EeDps',
    apiToken: '0PBkAIVQhnDIKM7kEo4rUE0JIDfzt5cftE',
    // 表ID映射
    tables: {
      users: 'tbl_users',
      transactions: 'tbl_transactions',
      positions: 'tbl_positions',
      contractOrders: 'tbl_contract_orders',
      binaryOrders: 'tbl_binary_orders',
      fundTransactions: 'tbl_fund_transactions',
      fundPositions: 'tbl_fund_positions',
      // 工作流表
      workflows: 'tbl_workflows',
      workflowTasks: 'tbl_workflow_tasks'
    }
  }
};