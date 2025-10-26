// api.ts - API工具函数

// 基金产品类型定义
export interface FundProduct {
  id: string;
  name: string;
  annualReturn: string;
  riskLevel: 'low' | 'medium' | 'high';
  period: string;
  scale: string;
  rate: number;
}

// 获取热门基金数据
export const fetchHotFunds = async (): Promise<FundProduct[]> => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟数据（实际项目中这里会是真实的API调用）
  return [
    { id: '1', name: '聚财日斗T8基金', annualReturn: '12.5%', riskLevel: 'medium', period: '6个月', scale: '2.8亿', rate: 4.8 },
    { id: '2', name: '聚财星月P6基金', annualReturn: '8.9%', riskLevel: 'low', period: '12个月', scale: '5.3亿', rate: 4.6 },
    { id: '3', name: '聚财风云Q9基金', annualReturn: '15.2%', riskLevel: 'high', period: '3个月', scale: '1.9亿', rate: 4.9 },
    { id: '4', name: '聚财华耀R3基金', annualReturn: '10.7%', riskLevel: 'medium', period: '9个月', scale: '3.5亿', rate: 4.7 },
  ];
};

// 其他API函数可以在这里添加
