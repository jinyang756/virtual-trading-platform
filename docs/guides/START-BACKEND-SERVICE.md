# 启动后端服务指南

根据您的应用类型，您需要启动相应的后端服务。

## Node.js 应用

如果您使用的是Node.js应用：

```bash
# 进入您的应用目录
cd /path/to/your/nodejs/app

# 安装依赖（如果尚未安装）
npm install

# 启动应用
npm start

# 或者使用node直接启动
node server.js

# 或者使用PM2（推荐用于生产环境）
pm2 start server.js
```

## Python 应用

如果您使用的是Python应用：

```bash
# 进入您的应用目录
cd /path/to/your/python/app

# 安装依赖（如果尚未安装）
pip install -r requirements.txt

# 启动应用
python app.py

# 或者使用gunicorn（推荐用于生产环境）
gunicorn app:app
```

## Java 应用

如果您使用的是Java应用：

```bash
# 进入您的应用目录
cd /path/to/your/java/app

# 编译并启动应用
mvn spring-boot:run

# 或者使用jar包启动
java -jar target/your-application.jar
```

## 其他注意事项

1. 确保您的应用监听在Nginx配置中指定的端口（根据之前的配置，应该是localhost:5173）

2. 检查防火墙设置，确保相应端口已开放

3. 如果应用需要特定环境变量，请确保它们已正确设置

## 验证服务状态

启动服务后，您可以使用以下命令验证服务是否正常运行：

```bash
# 检查本地服务是否响应
curl -I http://localhost:5173

# 或者使用PowerShell
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing
```

## 监控服务

建议使用进程管理工具来监控您的应用：

- PM2 (Node.js): `pm2 start server.js && pm2 save`
- Supervisor (Python): 配置supervisor配置文件
- Systemd (Linux): 创建systemd服务文件

## 日志查看

查看应用日志以排查问题：

```bash
# Node.js应用日志
tail -f /path/to/your/nodejs/app/logs/app.log

# 或者PM2日志
pm2 logs
```