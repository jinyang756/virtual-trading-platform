export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // 如果请求是API，则代理到实际的API服务器
    if (pathname.startsWith('/api/')) {
      // 目标API服务器地址
      const apiServer = 'http://localhost:3001'; // 这里需要替换为实际的服务器地址
      
      // 构造目标URL
      const targetUrl = apiServer + pathname;
      
      // 创建新的请求
      const newRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });
      
      // 发送请求并返回响应
      const response = await fetch(newRequest);
      return response;
    }
    
    // 对于非API请求，返回404
    return new Response('Not Found', { status: 404 });
  }
};