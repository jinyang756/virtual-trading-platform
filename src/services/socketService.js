const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const tradeService = require('./tradeService');

class SocketService {
  constructor() {
    this.io = null;
    this.clients = new Map(); // 存储已连接的客户端
  }

  /**
   * 初始化Socket.IO服务
   * @param {http.Server} server - HTTP服务器实例
   */
  init(server) {
    try {
      this.io = socketIO(server, {
        cors: {
          origin: ['https://jiuzhougroup.vip', 'https://jcstjj.top', 'http://localhost:5173', 'http://localhost:3000', 'https://your-cloudflare-subdomain.pages.dev'],
          methods: ['GET', 'POST'],
          credentials: true
        }
      });

      this.setupEventHandlers();
      console.log('Socket.IO服务已初始化');
    } catch (error) {
      console.error('Socket.IO服务初始化失败:', error);
      throw error;
    }
  }

  /**
   * 设置事件处理器
   */
  setupEventHandlers() {
    if (!this.io) return;
    
    this.io.on('connection', (socket) => {
      console.log(`客户端已连接: ${socket.id}`);

      // 认证事件
      socket.on('authenticate', (data) => {
        this.handleAuthentication(socket, data);
      });

      // 处理交易指令
      socket.on('place_trade', (tradeData, callback) => {
        this.handlePlaceTrade(socket, tradeData, callback);
      });

      // 断开连接事件
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });

      // 错误事件
      socket.on('error', (error) => {
        console.error(`Socket错误 [${socket.id}]:`, error);
      });
    });
  }

  /**
   * 处理客户端认证
   * @param {Socket} socket - Socket实例
   * @param {Object} data - 认证数据
   */
  handleAuthentication(socket, data) {
    try {
      const { token } = data;
      if (!token) {
        socket.emit('auth_error', { message: '缺少认证令牌' });
        return;
      }

      // 验证JWT令牌
      const decoded = jwt.verify(token, config.jwtSecret || 'default_secret');
      socket.userId = decoded.userId;
      
      // 存储客户端信息
      this.clients.set(socket.id, {
        userId: decoded.userId,
        username: decoded.username,
        connectedAt: new Date()
      });

      socket.emit('auth_success', { message: '认证成功' });
      console.log(`用户 ${decoded.username} (${decoded.userId}) 认证成功`);
    } catch (error) {
      console.error('认证失败:', error);
      socket.emit('auth_error', { message: '认证失败', error: error.message });
    }
  }

  /**
   * 处理交易指令
   * @param {Socket} socket - Socket实例
   * @param {Object} tradeData - 交易数据
   * @param {Function} callback - 回调函数
   */
  async handlePlaceTrade(socket, tradeData, callback) {
    try {
      // 检查用户是否已认证
      if (!socket.userId) {
        callback({ success: false, error: '用户未认证' });
        return;
      }

      // 使用交易服务处理交易
      const result = await tradeService.placeTrade(tradeData, socket.userId);
      
      // 发送响应
      callback({ success: true, data: result });
      
      // 向所有相关客户端广播交易更新
      this.broadcastTradeUpdate(result.data);
      
      // 广播市场更新
      this.broadcastMarketUpdate({
        symbol: tradeData.symbol,
        lastTrade: result.data
      });
    } catch (error) {
      console.error('处理交易指令失败:', error);
      callback({ success: false, error: error.message });
    }
  }

  /**
   * 处理客户端断开连接
   * @param {Socket} socket - Socket实例
   */
  handleDisconnect(socket) {
    console.log(`客户端断开连接: ${socket.id}`);
    this.clients.delete(socket.id);
  }

  /**
   * 广播市场数据更新
   * @param {Object} marketData - 市场数据
   */
  broadcastMarketUpdate(marketData) {
    if (!this.io) return;
    this.io.emit('market_update', marketData);
  }

  /**
   * 广播交易更新
   * @param {Object} tradeData - 交易数据
   */
  broadcastTradeUpdate(tradeData) {
    if (!this.io) return;
    this.io.emit('trade_update', tradeData);
  }

  /**
   * 向特定用户发送资金更新
   * @param {string} userId - 用户ID
   * @param {Object} fundData - 资金数据
   */
  sendFundUpdateToUser(userId, fundData) {
    if (!this.io) return;
    // 查找该用户的所有连接
    for (const [socketId, clientInfo] of this.clients.entries()) {
      if (clientInfo.userId === userId) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          socket.emit('fund_update', fundData);
        }
      }
    }
  }

  /**
   * 获取连接的客户端数量
   * @returns {number} 客户端数量
   */
  getClientCount() {
    return this.clients.size;
  }

  /**
   * 获取所有连接的客户端信息
   * @returns {Array} 客户端信息数组
   */
  getClientsInfo() {
    return Array.from(this.clients.values());
  }

  /**
   * 清理资源
   */
  cleanup() {
    try {
      if (this.io) {
        this.io.close();
        this.io = null;
      }
      this.clients.clear();
      console.log('Socket.IO服务已清理');
    } catch (error) {
      console.error('清理Socket.IO服务时出错:', error);
    }
  }
}

// 创建单例实例
const socketService = new SocketService();

module.exports = socketService;