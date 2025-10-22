import React, { useState } from 'react';

export function TradePanel() {
  const [side, setSide] = useState('买入');
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    // 模拟提交订单
    console.log('提交订单:', { side, price, amount });
    
    // 这里应该调用API提交订单
    // fetch('/api/trade/order', {
    //   method: 'POST',
    //   body: JSON.stringify({ side, price, amount }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    
    // 提交后清空表单
    setPrice('');
    setAmount('');
  };

  return (
    <div className="p-4 border rounded space-y-2">
      <div className="flex gap-2">
        <button 
          onClick={() => setSide('买入')} 
          className={`px-4 py-2 flex-1 ${side === '买入' ? 'bg-green-500 text-white' : 'bg-gray-100'}`}
        >
          买入
        </button>
        <button 
          onClick={() => setSide('卖出')} 
          className={`px-4 py-2 flex-1 ${side === '卖出' ? 'bg-red-500 text-white' : 'bg-gray-100'}`}
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
      />
      <input 
        type="text" 
        placeholder="数量" 
        value={amount} 
        onChange={e => setAmount(e.target.value)} 
        className="w-full border p-2 rounded" 
      />
      <button 
        onClick={handleSubmit} 
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        提交订单
      </button>
    </div>
  );
}

export default TradePanel;