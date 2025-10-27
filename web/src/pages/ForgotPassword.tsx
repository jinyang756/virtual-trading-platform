import React, { useState } from 'react';
import { message } from 'antd';
import { authService } from '../services/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      message.success('重置密码邮件已发送，请检查邮箱');
    } catch (error) {
      message.error('发送失败，请稍后重试');
      console.error('忘记密码请求失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">忘记密码</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">邮箱</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 block w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? '发送中...' : '发送重置邮件'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
