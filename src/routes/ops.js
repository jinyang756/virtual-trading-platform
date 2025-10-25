const express = require('express');
const router = express.Router();
const { exec } = require('child_process');
const path = require('path');

// 脚本目录路径
const SCRIPTS_DIR = path.join(__dirname, '../../scripts');

// 统一运维脚本执行接口
router.post('/run-script', (req, res) => {
  const { script } = req.body;
  
  // 验证脚本名称，防止路径遍历攻击
  if (!script || script.includes('/') || script.includes('\\') || script.includes('..')) {
    return res.status(400).json({ 
      success: false, 
      message: '无效的脚本名称' 
    });
  }
  
  // 构造脚本路径
  const scriptPath = path.join(SCRIPTS_DIR, `${script}.sh`);
  
  // 检查脚本是否存在
  const fs = require('fs');
  if (!fs.existsSync(scriptPath)) {
    return res.status(404).json({ 
      success: false, 
      message: `脚本 ${script}.sh 不存在` 
    });
  }
  
  console.log(`执行脚本: ${scriptPath}`);
  
  // 在Windows环境下使用PowerShell执行bash脚本
  const command = `powershell -Command "bash '${scriptPath}'"`;
  
  // 执行脚本
  exec(command, { cwd: SCRIPTS_DIR }, (error, stdout, stderr) => {
    if (error) {
      console.error(`脚本执行失败: ${error}`);
      return res.status(500).json({ 
        success: false, 
        message: '脚本执行失败',
        error: stderr || error.message 
      });
    }
    
    res.json({ 
      success: true, 
      message: '脚本执行成功',
      output: stdout 
    });
  });
});

module.exports = router;