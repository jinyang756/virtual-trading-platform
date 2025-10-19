// 主应用逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('虚拟交易平台前端已加载');
    
    // 初始化页面功能
    initPage();
});

// 初始化页面功能
function initPage() {
    // 可以在这里添加页面初始化逻辑
    console.log('页面功能初始化完成');
}

// 用户注册
function registerUser() {
    // 获取表单数据
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 简单验证
    if (!username || !email || !password) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 发送注册请求
    fetch('/api/users/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('注册失败: ' + data.error);
        } else {
            alert('注册成功');
            // 跳转到登录页面
            window.location.href = '/login';
        }
    })
    .catch(error => {
        console.error('注册错误:', error);
        alert('注册过程中发生错误');
    });
}

// 用户登录
function loginUser() {
    // 获取表单数据
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 简单验证
    if (!email || !password) {
        alert('请填写邮箱和密码');
        return;
    }
    
    // 发送登录请求
    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('登录失败: ' + data.error);
        } else {
            alert('登录成功');
            // 保存认证令牌（简化处理）
            localStorage.setItem('authToken', 'valid-token');
            // 跳转到交易页面
            window.location.href = '/trade';
        }
    })
    .catch(error => {
        console.error('登录错误:', error);
        alert('登录过程中发生错误');
    });
}

// 创建订单
function createOrder() {
    // 获取表单数据
    const asset = document.getElementById('asset').value;
    const type = document.getElementById('type').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    
    // 简单验证
    if (!asset || !type || !quantity || !price) {
        alert('请填写所有必填字段');
        return;
    }
    
    // 获取认证令牌
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        window.location.href = '/login';
        return;
    }
    
    // 发送创建订单请求
    fetch('/api/trade/order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ asset, type, quantity: parseFloat(quantity), price: parseFloat(price) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert('创建订单失败: ' + data.error);
        } else {
            alert('订单创建成功');
            // 清空表单
            document.getElementById('orderForm').reset();
        }
    })
    .catch(error => {
        console.error('创建订单错误:', error);
        alert('创建订单过程中发生错误');
    });
}