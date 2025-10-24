module.exports = {
  // Teable数据库配置 - 支持环境变量覆盖
  teable: {
    apiBase: process.env.TEABLE_API_BASE || 'https://app.teable.cn',
    proxyBase: process.env.TEABLE_PROXY_BASE || 'http://localhost:42345',
    baseId: process.env.TEABLE_BASE_ID || 'bsesJG9zTxCFYUdcNyV',
    apiToken: process.env.TEABLE_API_TOKEN || 'teable_accuhrYz53wv4wl9Y5i_tM0WwnQSg0E4s/YZCdfL7cBSBYifAtYlFKgu46AmW0A=',
    // 表ID映射（已更新为实际创建的表ID）
    tables: {
      // 管理后台核心表
      users: 'tblJ5KsNs94ZkEJfnEy',
      roles: 'tblb8pqrqWB046vy5YQ',
      permissions: 'tblbHsLGOlTT0ftSzw3',
      logs: '',
      
      // 业务表
      transactions: '',
      positions: '',
      contractOrders: '',
      binaryOrders: '',
      fundTransactions: '',
      fundPositions: '',
      workflows: '',
      workflowTasks: '',
      
      // 基金相关表
      funds: 'tblNrHE1BPVDXZZ92uf',
      fund_net_value: 'tblSgTXOxgltRh32w6q'
    }
  }
};