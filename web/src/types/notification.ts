export type NotificationType = 'system' | 'trade' | 'risk';
export type NotificationStatus = 'success' | 'failed' | 'pending';
export type ProductType = 'fund' | 'option' | 'contract';

export interface NotificationTypeConfig {
  text: string;
  color: string;
}

export interface NotificationStatusConfig {
  text: string;
  color: string;
}

export interface ProductTypeConfig {
  text: string;
  color: string;
}

export const NOTIFICATION_TYPES: Record<NotificationType, NotificationTypeConfig> = {
  system: { text: '系统通知', color: '#1890ff' },
  trade: { text: '交易通知', color: '#52c41a' },
  risk: { text: '风险提示', color: '#faad14' },
};

export const NOTIFICATION_STATUS: Record<NotificationStatus, NotificationStatusConfig> = {
  success: { text: '成功', color: 'success' },
  failed: { text: '失败', color: 'error' },
  pending: { text: '处理中', color: 'processing' },
};

export const PRODUCT_TYPES: Record<ProductType, ProductTypeConfig> = {
  fund: { text: '基金', color: '#1890ff' },
  option: { text: '期权', color: '#52c41a' },
  contract: { text: '合约', color: '#faad14' },
};