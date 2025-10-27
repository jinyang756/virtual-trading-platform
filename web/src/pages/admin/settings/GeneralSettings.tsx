import React from 'react';
import { Form, Input, Switch, Button, message } from 'antd';

interface GeneralSettingsData {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  maintenanceMode: boolean;
}

const GeneralSettings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: GeneralSettingsData) => {
    try {
      await fetch('/api/admin/settings/general', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('基本设置已更新');
    } catch (error) {
      message.error('更新失败');
    }
  };

  return (
    <div className="max-w-2xl">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          siteName: '虚拟交易平台',
          siteDescription: '专业的虚拟交易培训平台',
          contactEmail: 'admin@example.com',
          maintenanceMode: false,
        }}
      >
        <Form.Item
          name="siteName"
          label="网站名称"
          rules={[{ required: true, message: '请输入网站名称' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="siteDescription"
          label="网站描述"
          rules={[{ required: true, message: '请输入网站描述' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="contactEmail"
          label="联系邮箱"
          rules={[
            { required: true, message: '请输入联系邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="maintenanceMode"
          label="维护模式"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存设置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GeneralSettings;