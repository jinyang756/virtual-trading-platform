import React, { useState } from 'react';
import { message } from 'antd';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth';
import { useCountdown } from '../hooks/useCountdown';
import '../../public/css/login.css';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    verifyCode: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    verifyCode: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
    const { countdown, startCountdown } = useCountdown();

  // 表单输入处理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 清除对应字段的错误信息
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 表单验证
  const validateForm = () => {
    const newErrors = { username: '', password: '', verifyCode: '' };
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名或手机号';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6位';
      isValid = false;
    }

    if (!formData.verifyCode) {
      newErrors.verifyCode = '请输入验证码';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 发送验证码
  const handleSendVerifyCode = async () => {
    if (!formData.username.trim()) {
      setErrors(prev => ({
        ...prev,
        username: '请输入用户名或手机号'
      }));
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendVerifyCode(formData.username);
      startCountdown(formData.username);
      message.success('验证码已发送到您的手机');
    } catch (error) {
      message.error('验证码发送失败，请稍后重试');
      console.error('验证码发送失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(formData);
      login({
        ...response.user,
        token: response.token,
        refreshToken: response.refreshToken
      });
    } catch (error) {
      message.error('登录失败，请检查用户名和密码');
      console.error('登录失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-neutral-dark">
      {/* 动态背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* 浮动金融图标 */}
        <div className="absolute top-20 left-10 w-12 h-12 text-primary/20 floating">
          <i className="fa fa-line-chart text-2xl"></i>
        </div>
        <div className="absolute top-40 right-20 w-10 h-10 text-secondary/20 floating delay-1000">
          <i className="fa fa-bitcoin text-xl"></i>
        </div>
        <div className="absolute bottom-32 left-1/4 w-8 h-8 text-accent/20 floating delay-2000">
          <i className="fa fa-money text-lg"></i>
        </div>
        <div className="absolute bottom-20 right-1/3 w-10 h-10 text-warning/20 floating delay-3000">
          <i className="fa fa-bank text-xl"></i>
        </div>
      </div>

      {/* 登录表单 */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 左侧品牌信息 */}
            <div className="hidden lg:block slide-up">
              <div className="text-white space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">
                  聚财众发<span className="text-secondary">虚拟交易平台</span>
                </h1>
                <p className="text-xl text-gray-300">
                  专业、安全、高效的虚拟交易体验
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <i className="fa fa-shield text-2xl text-secondary mb-2"></i>
                    <h3 className="font-semibold">安全保障</h3>
                    <p className="text-sm text-gray-300">银行级安全防护</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <i className="fa fa-bolt text-2xl text-accent mb-2"></i>
                    <h3 className="font-semibold">极速交易</h3>
                    <p className="text-sm text-gray-300">毫秒级交易执行</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <i className="fa fa-mobile text-2xl text-warning mb-2"></i>
                    <h3 className="font-semibold">移动支持</h3>
                    <p className="text-sm text-gray-300">随时随地交易</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
                    <i className="fa fa-line-chart text-2xl text-primary mb-2"></i>
                    <h3 className="font-semibold">实时行情</h3>
                    <p className="text-sm text-gray-300">全球市场数据</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧登录表单 */}
            <div className="slide-up">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-10 border border-primary/20 bounce-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white">欢迎回来</h2>
                  <p className="text-gray-400 mt-2">请登录您的账户</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 用户名输入框 */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      <i className="fa fa-user mr-2 text-secondary"></i>
                      用户名/手机号
                    </label>
                    <input 
                      type="text" 
                      name="username" 
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-dark/50 border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="请输入用户名或手机号"
                      required
                    />
                    {errors.username && (
                      <p className="text-warning text-sm">{errors.username}</p>
                    )}
                  </div>

                  {/* 密码输入框 */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      <i className="fa fa-lock mr-2 text-secondary"></i>
                      密码
                    </label>
                    <input 
                      type="password" 
                      name="password" 
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-dark/50 border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-white placeholder-gray-400 transition-all duration-300"
                      placeholder="请输入密码"
                      required
                    />
                    {errors.password && (
                      <p className="text-warning text-sm">{errors.password}</p>
                    )}
                  </div>

                  {/* 验证码输入框 */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      <i className="fa fa-shield mr-2 text-secondary"></i>
                      验证码
                    </label>
                    <div className="flex space-x-3">
                      <input 
                        type="text" 
                        name="verifyCode" 
                        value={formData.verifyCode}
                        onChange={handleChange}
                        className="flex-1 px-4 py-3 bg-neutral-dark/50 border rounded-lg focus:border-secondary focus:ring-2 focus:ring-secondary/20 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="请输入验证码"
                        required
                      />
                      <button
                        type="button"
                        onClick={handleSendVerifyCode}
                        disabled={countdown > 0 || isLoading}
                        className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                          countdown > 0 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                            : 'bg-secondary hover:bg-secondary/80 text-white'
                        }`}
                      >
                        {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                      </button>
                    </div>
                    {errors.verifyCode && (
                      <p className="text-warning text-sm">{errors.verifyCode}</p>
                    )}
                  </div>

                  {/* 登录按钮 */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-secondary to-accent hover:from-secondary/80 hover:to-accent/80 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <i className="fa fa-spinner fa-spin mr-2"></i>
                          登录中...
                        </span>
                      ) : (
                        '登录'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-400">
                  <p>
                    还没有账户？{' '}
                    <a href="#" className="text-secondary hover:underline">
                      立即注册
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;