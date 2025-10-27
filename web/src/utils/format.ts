/**
 * 格式化金额为带指定位数小数的字符串
 * @param amount 金额
 * @param decimals 小数位数，默认为2
 */
export const formatMoney = (amount: number, decimals: number = 2): string => {
  return amount.toFixed(decimals);
};

/**
 * 格式化百分比为带指定位数小数的字符串，末尾带%符号
 * @param value 数值
 * @param decimals 小数位数，默认为2
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * 将时间字符串或时间对象格式化为本地可读字符串
 * @param time 时间字符串或 Date 对象（可选）
 */
export const formatDateTime = (time?: string | Date | null): string => {
  if (!time) return '-';
  const d = typeof time === 'string' ? new Date(time) : time;
  if (Number.isNaN(d?.getTime?.())) return '-';
  return d.toLocaleString();
};