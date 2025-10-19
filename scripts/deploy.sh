#!/bin/bash

# 虚拟交易平台部署脚本

# 设置变量
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_FILE="$PROJECT_DIR/logs/deploy.log"

# 创建日志目录
mkdir -p "$PROJECT_DIR/logs"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查Node.js是否安装
check_node() {
    if ! command -v node &> /dev/null; then
        log "错误: Node.js未安装"
        exit 1
    fi
    
    local node_version=$(node --version)
    log "Node.js版本: $node_version"
}

# 检查npm是否安装
check_npm() {
    if ! command -v npm &> /dev/null; then
        log "错误: npm未安装"
        exit 1
    fi
    
    local npm_version=$(npm --version)
    log "npm版本: $npm_version"
}

# 安装依赖
install_dependencies() {
    log "安装项目依赖..."
    
    cd "$PROJECT_DIR"
    npm install
    
    if [ $? -eq 0 ]; then
        log "依赖安装成功"
    else
        log "依赖安装失败"
        exit 1
    fi
}

# 备份现有数据
backup_data() {
    log "备份现有数据..."
    
    cd "$PROJECT_DIR"
    node scripts/backup.js
    
    if [ $? -eq 0 ]; then
        log "数据备份成功"
    else
        log "数据备份失败"
        exit 1
    fi
}

# 启动服务
start_service() {
    log "启动服务..."
    
    cd "$PROJECT_DIR"
    
    # 检查是否有PM2
    if command -v pm2 &> /dev/null; then
        pm2 start server.js --name "virtual-trading-platform"
        log "服务已通过PM2启动"
    else
        # 使用npm start启动
        npm start &
        log "服务已在后台启动"
    fi
}

# 重启服务
restart_service() {
    log "重启服务..."
    
    # 检查是否有PM2
    if command -v pm2 &> /dev/null; then
        pm2 restart "virtual-trading-platform"
        log "服务已通过PM2重启"
    else
        # 杀死现有进程并重新启动
        pkill -f "node server.js" 2>/dev/null
        cd "$PROJECT_DIR"
        npm start &
        log "服务已重启"
    fi
}

# 停止服务
stop_service() {
    log "停止服务..."
    
    # 检查是否有PM2
    if command -v pm2 &> /dev/null; then
        pm2 stop "virtual-trading-platform"
        log "服务已通过PM2停止"
    else
        # 杀死现有进程
        pkill -f "node server.js" 2>/dev/null
        log "服务已停止"
    fi
}

# 显示服务状态
status_service() {
    # 检查是否有PM2
    if command -v pm2 &> /dev/null; then
        pm2 status "virtual-trading-platform"
    else
        # 检查进程是否存在
        if pgrep -f "node server.js" > /dev/null; then
            log "服务正在运行"
        else
            log "服务未运行"
        fi
    fi
}

# 主函数
main() {
    log "开始部署虚拟交易平台..."
    
    check_node
    check_npm
    install_dependencies
    backup_data
    start_service
    
    log "部署完成!"
}

# 根据参数执行不同操作
case "$1" in
    "start")
        start_service
        ;;
    "stop")
        stop_service
        ;;
    "restart")
        restart_service
        ;;
    "status")
        status_service
        ;;
    "backup")
        backup_data
        ;;
    *)
        main
        ;;
esac