import React from 'react';
import { Form, Input, Button, Select, InputNumber, message, Switch } from 'antd';

interface SecuritySettingsData {
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    requireUppercase: boolean;
    expiryDays: number;
  };
  loginAttempts: {
    maxAttempts: number;
    lockoutDuration: number;
  };
  twoFactorAuth: {
    enabled: boolean;
    type: 'sms' | 'email' | 'authenticator';
  };
}

const SecuritySettings: React.FC = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values: SecuritySettingsData) => {
    try {
      await fetch('/api/admin/settings/security', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('安全设置已更新');
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
          passwordPolicy: {
            minLength: 8,
            requireNumbers: true,
            requireSpecialChars: true,
            requireUppercase: true,
            expiryDays: 90,
          },
          loginAttempts: {
            maxAttempts: 5,
            lockoutDuration: 30,
          },
          twoFactorAuth: {
            enabled: false,
            type: 'authenticator',
          },
        }}
      >
        <h3 className="text-lg font-medium mb-4">密码策略</h3>
        <Form.Item
          name={['passwordPolicy', 'minLength']}
          label="最小密码长度"
        >
          <InputNumber min={6} max={32} />
        </Form.Item>

        <Form.Item
          name={['passwordPolicy', 'requireNumbers']}
          valuePropName="checked"
          label="需要包含数字"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name={['passwordPolicy', 'requireSpecialChars']}
          valuePropName="checked"
          label="需要包含特殊字符"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name={['passwordPolicy', 'requireUppercase']}
          valuePropName="checked"
          label="需要包含大写字母"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name={['passwordPolicy', 'expiryDays']}
          label="密码过期天数"
        >
          <InputNumber min={0} max={365} />
        </Form.Item>

        <h3 className="text-lg font-medium mb-4 mt-8">登录尝试</h3>
        <Form.Item
          name={['loginAttempts', 'maxAttempts']}
          label="最大尝试次数"
        >
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item
          name={['loginAttempts', 'lockoutDuration']}
          label="锁定时长(分钟)"
        >
          <InputNumber min={5} max={1440} />
        </Form.Item>

        <h3 className="text-lg font-medium mb-4 mt-8">双因素认证</h3>
        <Form.Item
          name={['twoFactorAuth', 'enabled']}
          valuePropName="checked"
          label="启用双因素认证"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          name={['twoFactorAuth', 'type']}
          label="认证方式"
        >
          <Select>
            <Select.Option value="authenticator">认证器</Select.Option>
            <Select.Option value="sms">短信</Select.Option>
            <Select.Option value="email">邮件</Select.Option>
          </Select>
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

export default SecuritySettings;