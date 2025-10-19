const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDefaultRoles } = require('./utils/defaultRoles');

// 路由导入
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const configRouter = require('./routes/config');
const tradeRouter = require('./routes/trade');
const marketRouter = require('./routes/market');
const adminRouter = require('./routes/admin');
const historicalRouter = require('./routes/historical');

// 中间件导入
const authMiddleware = require('./middleware/auth');
const validationMiddleware = require('./middleware/validation');
const { enhancedErrorHandler, notFoundHandler } = require('./middleware/enhancedErrorHandler');

const app = express();

// 视图引擎设置
app.set('views', path.join(__dirname, '../templates'));
app.set('view engine', 'ejs');

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// 初始化默认角色
initializeDefaultRoles().catch(error => {
  console.error('初始化默认角色失败:', error);
});

// 路由
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/config', configRouter);
app.use('/api/trade', tradeRouter);
app.use('/api/market', marketRouter);
app.use('/api/admin', adminRouter);
app.use('/api/historical', historicalRouter);

// 404错误处理
app.use(notFoundHandler);

// 错误处理中间件
app.use(enhancedErrorHandler);

module.exports = app;