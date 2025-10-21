// Vercel API 路由测试文件
module.exports = (req, res) => {
  res.status(200).json({ 
    message: 'Vercel API 路由测试成功',
    timestamp: new Date().toISOString(),
    platform: '虚拟交易平台'
  });
};