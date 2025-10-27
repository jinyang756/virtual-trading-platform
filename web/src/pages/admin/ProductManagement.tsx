import React from 'react';
import { Tabs, Card } from 'antd';
import { FundManagement } from './products/FundManagement';
import { ContractManagement } from './products/ContractManagement';
import { OptionManagement } from './products/OptionManagement';

const { TabPane } = Tabs;

const ProductManagement: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <Tabs defaultActiveKey="fund">
          <TabPane tab="基金管理" key="fund">
            <FundManagement />
          </TabPane>
          <TabPane tab="合约管理" key="contract">
            <ContractManagement />
          </TabPane>
          <TabPane tab="期权管理" key="option">
            <OptionManagement />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ProductManagement;