import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import GeneralSettings from './settings/GeneralSettings';
import SecuritySettings from './settings/SecuritySettings';
import LogSettings from './settings/LogSettings';
import BackupSettings from './settings/BackupSettings';

const { TabPane } = Tabs;

const SystemManagement: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <Tabs defaultActiveKey="general">
          <TabPane tab="基本设置" key="general">
            <GeneralSettings />
          </TabPane>
          <TabPane tab="安全设置" key="security">
            <SecuritySettings />
          </TabPane>
          <TabPane tab="日志管理" key="logs">
            <LogSettings />
          </TabPane>
          <TabPane tab="备份管理" key="backup">
            <BackupSettings />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SystemManagement;