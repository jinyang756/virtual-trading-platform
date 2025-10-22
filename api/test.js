// Vercel测试API端点
module.exports = (req, res) => {
  res.status(200).json({
    message: 'Vercel API测试端点工作正常',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url
  });
};