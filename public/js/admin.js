// 管理端逻辑

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('管理端前端已加载');
    
    // 初始化管理面板
    initAdminPanel();
});

// 初始化管理面板
function initAdminPanel() {
    // 获取统计数据
    fetchStats();
    
    // 可以在这里添加其他初始化逻辑
    console.log('管理面板初始化完成');
}

// 获取统计数据
function fetchStats() {
    // 获取认证令牌
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        window.location.href = '/admin/login';
        return;
    }
    
    // 获取用户总数
    fetch('/api/admin/users', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('totalUsers').textContent = data.length || 0;
    })
    .catch(error => {
        console.error('获取用户数据错误:', error);
    });
    
    // 获取交易总数
    // 这里简化处理，实际应该调用相应的API
    document.getElementById('totalTransactions').textContent = '0';
}

// 备份数据
function backupData() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        return;
    }
    
    if (confirm('确定要备份数据吗？')) {
        // 显示备份进度
        const backupBtn = document.getElementById('backupBtn');
        const originalHTML = backupBtn.innerHTML;
        backupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 备份中...';
        backupBtn.disabled = true;
        
        // 发送备份请求
        fetch('/api/admin/backup', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('备份失败: ' + data.error);
            } else {
                alert('数据备份成功');
                // 刷新备份列表
                loadBackups();
            }
        })
        .catch(error => {
            console.error('备份错误:', error);
            alert('备份过程中发生错误');
        })
        .finally(() => {
            // 恢复按钮状态
            backupBtn.innerHTML = originalHTML;
            backupBtn.disabled = false;
        });
    }
}

// 加载备份列表
function loadBackups() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        return;
    }
    
    // 发送请求获取备份列表
    fetch('/api/admin/backups', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(backups => {
        const backupList = document.getElementById('backupList');
        backupList.innerHTML = '';
        
        if (backups.length === 0) {
            backupList.innerHTML = '<p>没有找到备份</p>';
            return;
        }
        
        backups.forEach(backup => {
            const item = document.createElement('div');
            item.className = 'backup-item';
            item.innerHTML = `
                <div class="backup-info">
                    <div class="backup-name">${backup.name}</div>
                    <div class="backup-date">${new Date(backup.created).toLocaleString()}</div>
                </div>
                <div class="backup-actions">
                    <button class="btn btn-sm btn-warning" onclick="restoreBackup('${backup.name}')">
                        <i class="fas fa-undo"></i> 恢复
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBackup('${backup.name}')">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </div>
            `;
            backupList.appendChild(item);
        });
    })
    .catch(error => {
        console.error('加载备份列表错误:', error);
    });
}

// 恢复备份
function restoreBackup(backupName) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        return;
    }
    
    if (confirm(`确定要恢复备份 ${backupName} 吗？这将覆盖当前数据。`)) {
        // 发送恢复请求
        fetch('/api/admin/restore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ backupName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('恢复失败: ' + data.error);
            } else {
                alert('备份恢复成功');
            }
        })
        .catch(error => {
            console.error('恢复错误:', error);
            alert('恢复过程中发生错误');
        });
    }
}

// 删除备份
function deleteBackup(backupName) {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        return;
    }
    
    if (confirm(`确定要删除备份 ${backupName} 吗？`)) {
        // 发送删除请求
        fetch(`/api/admin/backups/${backupName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('删除失败: ' + data.error);
            } else {
                alert('备份删除成功');
                // 刷新备份列表
                loadBackups();
            }
        })
        .catch(error => {
            console.error('删除错误:', error);
            alert('删除过程中发生错误');
        });
    }
}

// 清理日志
function clearLogs() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        return;
    }
    
    if (confirm('确定要清理日志吗？这将删除所有历史日志记录。')) {
        // 发送清理日志请求
        fetch('/api/admin/clear-logs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('清理日志失败: ' + data.error);
            } else {
                alert('日志清理成功');
            }
        })
        .catch(error => {
            console.error('清理日志错误:', error);
            alert('清理日志过程中发生错误');
        });
    }
}

// 重启服务
function restartServer() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('请先登录');
        return;
    }
    
    if (confirm('确定要重启服务吗？这将中断所有当前连接。')) {
        // 发送重启服务请求
        fetch('/api/admin/restart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('重启服务失败: ' + data.error);
            } else {
                alert('服务重启成功');
            }
        })
        .catch(error => {
            console.error('重启服务错误:', error);
            alert('重启服务过程中发生错误');
        });
    }
}