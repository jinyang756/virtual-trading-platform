import React, { useState } from 'react';
import apiClient from '../../services/api';

export function TradePanel() {
  const [side, setSide] = useState('买入');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // 验证输入
    if (!price || !amount) {
      setMessage('请输入价格和数量');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // 调用API提交订单
      const response = await apiClient.post('/trade/order', {
        side,
        price: parseFloat(price),
        amount: parseFloat(amount)
      });

      if (response.success) {
        setMessage('订单提交成功');
        // 提交后清空表单
        setPrice('');
        setAmount('');
      } else {
        setMessage(response.message || '订单提交失败');
      }
    } catch (error) {
      console.error('提交订单失败:', error);
      setMessage('订单提交失败: ' + (error.message || '未知错误'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <div className="flex gap-2">
        <button 
          onClick={() => setSide('买入')} 
          className={`px-4 py-2 flex-1 ${side === '买入' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
          disabled={isLoading}
        >
          买入
        </button>
        <button 
          onClick={() => setSide('卖出')} 
          className={`px-4 py-2 flex-1 ${side === '卖出' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
          disabled={isLoading}
        >
          卖出
        </button>
      </div>
      <input 
        type="text" 
        placeholder="价格" 
        value={price} 
        onChange={e => setPrice(e.target.value)} 
        className="w-full border p-2 rounded" 
        disabled={isLoading}
      />
      <input 
        type="text" 
        placeholder="数量" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        className="w-full border p-2 rounded" 
        disabled={isLoading}
      />
      <button 
        onClick={handleSubmit} 
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? '提交中...' : '提交订单'}
      </button>
      {message && (
        <div className={`text-center text-sm ${message.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default TradePanel;