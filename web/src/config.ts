export const API_BASE_URL = import.meta.env.VITE_API_BASE || '/api';
export const WS_BASE_URL = import.meta.env.VITE_WS_BASE || 'ws://localhost:8080';

export const APP_CONFIG = {
  defaultPageSize: 10,
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss',
  currencySymbol: '￥',
  decimalPlaces: 2
};