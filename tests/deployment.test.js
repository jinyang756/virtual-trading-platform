/**
 * 部署和运维功能测试
 */

describe('部署和运维功能测试', () => {
  test('应该能够导入自动化部署脚本', () => {
    const deployScript = require('../scripts/deploy-auto');
    expect(deployScript).toBeDefined();
    expect(typeof deployScript.deploy).toBe('function');
    expect(typeof deployScript.blueGreenDeploy).toBe('function');
  });

  test('应该能够导入健康检查脚本', () => {
    const healthCheckScript = require('../scripts/health-check');
    expect(healthCheckScript).toBeDefined();
    expect(typeof healthCheckScript.healthCheck).toBe('function');
    expect(typeof healthCheckScript.selfHealing).toBe('function');
  });

  test('应该能够导入自动化备份脚本', () => {
    const backupScript = require('../scripts/auto-backup');
    expect(backupScript).toBeDefined();
    expect(typeof backupScript.backup).toBe('function');
    expect(typeof backupScript.createDatabaseBackup).toBe('function');
  });

  test('应该能够读取Docker相关文件', () => {
    const fs = require('fs');
    const path = require('path');
    
    // 检查Dockerfile是否存在
    const dockerfilePath = path.join(__dirname, '..', 'Dockerfile');
    expect(fs.existsSync(dockerfilePath)).toBe(true);
    
    // 检查docker-compose.yml是否存在
    const dockerComposePath = path.join(__dirname, '..', 'docker-compose.yml');
    expect(fs.existsSync(dockerComposePath)).toBe(true);
  });

  test('应该能够读取Kubernetes配置文件', () => {
    const fs = require('fs');
    const path = require('path');
    
    // 检查Kubernetes目录是否存在
    const k8sDir = path.join(__dirname, '..', 'k8s');
    expect(fs.existsSync(k8sDir)).toBe(true);
    
    // 检查关键的Kubernetes文件是否存在
    const deploymentFile = path.join(k8sDir, 'deployment.yaml');
    expect(fs.existsSync(deploymentFile)).toBe(true);
    
    const serviceFile = path.join(k8sDir, 'service.yaml');
    expect(fs.existsSync(serviceFile)).toBe(true);
  });
});