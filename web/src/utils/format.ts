/**
 * 格式化金额为带两位小数的字符串
 */
export const formatMoney = (amount: number): string => {
  return amount.toFixed(2);
};