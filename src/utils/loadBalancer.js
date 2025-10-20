/**
 * 负载均衡工具
 */

const logger = require('./logger');

class LoadBalancer {
  constructor() {
    this.servers = [];
    this.currentServerIndex = 0;
    this.healthChecks = new Map();
    this.loadBalancingStrategy = 'round-robin'; // round-robin, least-connections, weighted
  }

  /**
   * 添加服务器
   * @param {Object} server - 服务器配置
   */
  addServer(server) {
    this.servers.push({
      ...server,
      connections: 0,
      weight: server.weight || 1,
      healthy: true,
      lastCheck: Date.now()
    });
    
    logger.info('服务器已添加到负载均衡器', {
      server: server
    });
  }

  /**
   * 移除服务器
   * @param {string} serverId - 服务器ID
   */
  removeServer(serverId) {
    this.servers = this.servers.filter(server => server.id !== serverId);
    
    logger.info('服务器已从负载均衡器移除', {
      serverId: serverId
    });
  }

  /**
   * 轮询选择服务器
   * @returns {Object} 服务器配置
   */
  selectServerRoundRobin() {
    if (this.servers.length === 0) {
      throw new Error('没有可用的服务器');
    }
    
    // 过滤出健康的服务器
    const healthyServers = this.servers.filter(server => server.healthy);
    
    if (healthyServers.length === 0) {
      throw new Error('没有健康的服务器');
    }
    
    // 轮询选择
    const server = healthyServers[this.currentServerIndex % healthyServers.length];
    this.currentServerIndex = (this.currentServerIndex + 1) % healthyServers.length;
    
    // 增加连接数
    server.connections++;
    
    return server;
  }

  /**
   * 最少连接数选择服务器
   * @returns {Object} 服务器配置
   */
  selectServerLeastConnections() {
    if (this.servers.length === 0) {
      throw new Error('没有可用的服务器');
    }
    
    // 过滤出健康的服务器
    const healthyServers = this.servers.filter(server => server.healthy);
    
    if (healthyServers.length === 0) {
      throw new Error('没有健康的服务器');
    }
    
    // 选择连接数最少的服务器
    const server = healthyServers.reduce((min, server) => 
      server.connections < min.connections ? server : min, 
      healthyServers[0]
    );
    
    // 增加连接数
    server.connections++;
    
    return server;
  }

  /**
   * 加权轮询选择服务器
   * @returns {Object} 服务器配置
   */
  selectServerWeighted() {
    if (this.servers.length === 0) {
      throw new Error('没有可用的服务器');
    }
    
    // 过滤出健康的服务器
    const healthyServers = this.servers.filter(server => server.healthy);
    
    if (healthyServers.length === 0) {
      throw new Error('没有健康的服务器');
    }
    
    // 计算总权重
    const totalWeight = healthyServers.reduce((sum, server) => sum + server.weight, 0);
    
    // 生成随机数
    const random = Math.random() * totalWeight;
    
    // 根据权重选择服务器
    let currentWeight = 0;
    for (const server of healthyServers) {
      currentWeight += server.weight;
      if (random <= currentWeight) {
        // 增加连接数
        server.connections++;
        return server;
      }
    }
    
    // 如果没有找到，返回第一个服务器
    const server = healthyServers[0];
    server.connections++;
    return server;
  }

  /**
   * 选择服务器
   * @returns {Object} 服务器配置
   */
  selectServer() {
    switch (this.loadBalancingStrategy) {
      case 'round-robin':
        return this.selectServerRoundRobin();
      case 'least-connections':
        return this.selectServerLeastConnections();
      case 'weighted':
        return this.selectServerWeighted();
      default:
        return this.selectServerRoundRobin();
    }
  }

  /**
   * 释放服务器连接
   * @param {string} serverId - 服务器ID
   */
  releaseServer(serverId) {
    const server = this.servers.find(s => s.id === serverId);
    if (server && server.connections > 0) {
      server.connections--;
    }
  }

  /**
   * 健康检查
   * @param {string} serverId - 服务器ID
   * @param {boolean} isHealthy - 是否健康
   */
  updateHealth(serverId, isHealthy) {
    const server = this.servers.find(s => s.id === serverId);
    if (server) {
      server.healthy = isHealthy;
      server.lastCheck = Date.now();
      
      this.healthChecks.set(serverId, {
        healthy: isHealthy,
        timestamp: Date.now()
      });
      
      logger.info('服务器健康状态更新', {
        serverId: serverId,
        healthy: isHealthy
      });
    }
  }

  /**
   * 执行健康检查
   * @param {string} serverId - 服务器ID
   * @param {Function} healthCheckFn - 健康检查函数
   */
  async performHealthCheck(serverId, healthCheckFn) {
    try {
      const isHealthy = await healthCheckFn();
      this.updateHealth(serverId, isHealthy);
    } catch (error) {
      logger.error('健康检查失败', {
        serverId: serverId,
        error: error.message
      });
      this.updateHealth(serverId, false);
    }
  }

  /**
   * 定期健康检查
   * @param {Function} healthCheckFn - 健康检查函数
   * @param {number} interval - 检查间隔（毫秒）
   */
  startHealthChecks(healthCheckFn, interval = 30000) {
    setInterval(() => {
      this.servers.forEach(server => {
        this.performHealthCheck(server.id, healthCheckFn);
      });
    }, interval);
    
    logger.info('健康检查已启动', {
      interval: interval
    });
  }

  /**
   * 获取服务器状态
   * @returns {Array} 服务器状态列表
   */
  getServerStatus() {
    return this.servers.map(server => ({
      id: server.id,
      host: server.host,
      port: server.port,
      connections: server.connections,
      weight: server.weight,
      healthy: server.healthy,
      lastCheck: server.lastCheck
    }));
  }

  /**
   * 获取负载均衡统计
   * @returns {Object} 统计信息
   */
  getStats() {
    const totalServers = this.servers.length;
    const healthyServers = this.servers.filter(s => s.healthy).length;
    const totalConnections = this.servers.reduce((sum, server) => sum + server.connections, 0);
    
    return {
      totalServers: totalServers,
      healthyServers: healthyServers,
      unhealthyServers: totalServers - healthyServers,
      totalConnections: totalConnections,
      averageConnections: totalServers > 0 ? totalConnections / totalServers : 0,
      strategy: this.loadBalancingStrategy,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 设置负载均衡策略
   * @param {string} strategy - 策略名称
   */
  setStrategy(strategy) {
    if (['round-robin', 'least-connections', 'weighted'].includes(strategy)) {
      this.loadBalancingStrategy = strategy;
      logger.info('负载均衡策略已更新', {
        strategy: strategy
      });
    } else {
      logger.warn('无效的负载均衡策略', {
        strategy: strategy
      });
    }
  }

  /**
   * 获取当前策略
   * @returns {string} 当前策略
   */
  getStrategy() {
    return this.loadBalancingStrategy;
  }

  /**
   * 重置统计信息
   */
  resetStats() {
    this.servers.forEach(server => {
      server.connections = 0;
    });
    this.currentServerIndex = 0;
    
    logger.info('负载均衡统计已重置');
  }
}

// 创建单例实例
const loadBalancer = new LoadBalancer();

module.exports = loadBalancer;