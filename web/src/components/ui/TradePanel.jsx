import React, { useState } from 'react';
import useOrder from '../../hooks/useOrder';

export function TradePanel() {
  const [side, setSide] = useState('买入');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [code, setCode] = useState('');
  const { isSubmitting, submitStatus, submitOrder } = useOrder();

  const handleSubmit = async () => {
    // 验证输入
    if (!code || !price || !amount) {
      // 这里应该显示错误信息，但为了简化，我们直接返回
      return;
    }

    // 调用API提交订单
    await submitOrder({
      code,
      side,
      price: parseFloat(price),
      amount: parseFloat(amount)
    });
  };

  return (
    <div className="space-y-2">
      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="资产代码"
        className="border p-2 w-full"
        disabled={isSubmitting}
      />
      <input
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="数量"
        className="border p-2 w-full"
        disabled={isSubmitting}
      />
      <input
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="价格"
        className="border p-2 w-full"
        disabled={isSubmitting}
      />
      <select 
        value={side} 
        onChange={e => setSide(e.target.value)} 
        className="border p-2 w-full"
        disabled={isSubmitting}
      >
        <option value="买入">买入</option>
        <option value="卖出">卖出</option>
      </select>
      <button 
        onClick={handleSubmit} 
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? '提交中...' : '提交订单'}
      </button>
      {submitStatus && (
        <p className={`text-sm ${submitStatus.includes('成功') ? 'text-green-500' : 'text-red-500'}`}>
          {submitStatus}
        </p>
      )}
    </div>
  );
}

export default TradePanel;