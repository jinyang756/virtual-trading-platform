#!/bin/bash

# Nginx 服务管理脚本
# 用于管理虚拟交易平台的 Nginx 服务

# 配置文件路径
NGINX_CONF="/etc/nginx/sites-available/zhengzutouzi.conf"
NGINX_LINK="/etc/nginx/sites-enabled/zhengzutouzi.conf"

# 项目Nginx配置文件路径
PROJECT_NGINX_CONF="./nginx/zhengzutouzi.conf"

show_help() {
    echo "🔧 Nginx 服务管理工具"
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  setup     设置 Nginx 配置"
    echo "  start     启动 Nginx 服务"
    echo "  stop      停止 Nginx 服务"
    echo "  restart   重启 Nginx 服务"
    echo "  status    查看 Nginx 状态"
    echo "  test      测试 Nginx 配置"
    echo "  logs      查看 Nginx 日志"
    echo "  help      显示此帮助信息"
}

setup_nginx() {
    echo "⚙️  设置 Nginx 配置..."
    
    # 检查 Nginx 是否已安装
    if ! command -v nginx &> /dev/null
    then
        echo "❌ 未安装 Nginx，请先安装 Nginx"
        exit 1
    fi
    
    # 复制配置文件
    echo "📋 复制配置文件到 $NGINX_CONF"
    sudo cp $PROJECT_NGINX_CONF $NGINX_CONF
    
    # 创建软链接
    echo "🔗 创建软链接到 $NGINX_LINK"
    sudo ln -sf $NGINX_CONF $NGINX_LINK
    
    # 测试配置
    echo "🔍 测试 Nginx 配置..."
    sudo nginx -t
    
    if [ $? -eq 0 ]; then
        echo "✅ Nginx 配置测试通过"
        echo "🔄 重新加载 Nginx..."
        sudo systemctl reload nginx
        echo "✅ Nginx 配置已生效"
    else
        echo "❌ Nginx 配置测试失败"
        exit 1
    fi
}

start_nginx() {
    echo "🚀 启动 Nginx 服务..."
    sudo systemctl start nginx
    echo "✅ Nginx 服务已启动"
}

stop_nginx() {
    echo "🛑 停止 Nginx 服务..."
    sudo systemctl stop nginx
    echo "✅ Nginx 服务已停止"
}

restart_nginx() {
    echo "🔄 重启 Nginx 服务..."
    sudo systemctl restart nginx
    echo "✅ Nginx 服务已重启"
}

status_nginx() {
    echo "📊 Nginx 服务状态:"
    sudo systemctl status nginx
}

test_nginx() {
    echo "🔍 测试 Nginx 配置..."
    sudo nginx -t
}

logs_nginx() {
    echo "📋 查看 Nginx 错误日志:"
    sudo tail -f /var/log/nginx/error.log
}

# 主程序
case "$1" in
    setup)
        setup_nginx
        ;;
    start)
        start_nginx
        ;;
    stop)
        stop_nginx
        ;;
    restart)
        restart_nginx
        ;;
    status)
        status_nginx
        ;;
    test)
        test_nginx
        ;;
    logs)
        logs_nginx
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ 未知选项: $1"
        show_help
        exit 1
        ;;
esac