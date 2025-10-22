const app = require('./src/app');

// 如果不是在特定云环境，则直接启动服务器
if (!process.env.CLOUD_ENV) {
  const PORT = process.env.PORT || 3001;
  
  // 启动服务器
  const server = app.listen(PORT, () => {
    console.log(`Virtual Trading Platform server is running on port ${PORT}`);
    console.log(`系统管理面板访问地址: http://localhost:${PORT}/admin/panel`);
    console.log(`用户端仪表板访问地址: http://localhost:${PORT}/client/dashboard`);
    console.log(`移动端客户端访问地址: http://localhost:${PORT}/mobile`);
  });

  module.exports = server;
} else {
  // 在云环境中，只导出应用实例
  module.exports = app;
}