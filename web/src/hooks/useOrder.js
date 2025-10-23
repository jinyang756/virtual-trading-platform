import { useState } from 'react';
import apiClient from '../services/api';

export default function useOrder() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const submitOrder = async (orderData) => {
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await apiClient.post('/trade/order', orderData);
      
      if (response.success) {
        setSubmitStatus('下单成功');
        return { success: true, data: response };
      } else {
        setSubmitStatus(response.message || '下单失败');
        return { success: false, error: response.message || '下单失败' };
      }
    } catch (error) {
      console.error('提交订单失败:', error);
      setSubmitStatus('订单提交失败: ' + (error.message || '未知错误'));
      return { success: false, error: error.message || '未知错误' };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitStatus,
    submitOrder
  };
}