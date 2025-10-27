import { notification } from 'antd';
import { AxiosError } from 'axios';

interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export class ErrorHandler {
  static handle(error: unknown): void {
    if (this.isAxiosError(error)) {
      this.handleAxiosError(error);
    } else if (error instanceof Error) {
      this.handleGenericError(error);
    } else {
      this.handleUnknownError(error);
    }
  }

  private static isAxiosError(error: unknown): error is AxiosError<ApiError> {
    return (error as AxiosError).isAxiosError;
  }

  private static handleAxiosError(error: AxiosError<ApiError>): void {
    const response = error.response;
    
    if (!response) {
      this.handleNetworkError(error);
      return;
    }

    const { status } = response;
    const data = response.data as ApiError;

    switch (status) {
      case 400:
        this.showError('请求错误', data.message || '输入数据无效');
        break;
      case 401:
        this.showError('未授权', '请重新登录');
        // TODO: 重定向到登录页面
        break;
      case 403:
        this.showError('访问被拒绝', '您没有权限执行此操作');
        break;
      case 404:
        this.showError('未找到', data.message || '请求的资源不存在');
        break;
      case 422:
        this.showError('验证错误', data.message || '提供的数据无效');
        break;
      case 500:
        this.showError('服务器错误', '服务器内部错误，请稍后重试');
        break;
      default:
        this.showError('错误', data.message || '发生未知错误');
    }

    // 记录错误详情到控制台
    console.error('API Error:', {
      status,
      data,
      url: error.config?.url,
      method: error.config?.method,
    });
  }

  private static handleNetworkError(error: AxiosError): void {
    if (error.code === 'ECONNABORTED') {
      this.showError('请求超时', '服务器响应超时，请检查网络连接');
    } else {
      this.showError('网络错误', '无法连接到服务器，请检查网络连接');
    }
  }

  private static handleGenericError(error: Error): void {
    this.showError('错误', error.message);
    console.error('Generic Error:', error);
  }

  private static handleUnknownError(error: unknown): void {
    this.showError('未知错误', '发生未知错误');
    console.error('Unknown Error:', error);
  }

  private static showError(title: string, message: string): void {
    notification.error({
      message: title,
      description: message,
      duration: 4.5,
    });
  }

  static showSuccess(title: string, message: string): void {
    notification.success({
      message: title, 
      description: message,
      duration: 3,
    });
  }

  static showWarning(title: string, message: string): void {
    notification.warning({
      message: title,
      description: message,
      duration: 4,
    });
  }

  static showInfo(title: string, message: string): void {
    notification.info({
      message: title,
      description: message,
      duration: 3,
    });
  }

  // 处理表单验证错误
  static handleFormValidationErrors(errors: Record<string, string>): void {
    Object.values(errors).forEach((msg) => {
      this.showError('表单错误', msg);
    });
  }

  // 处理批量操作结果
  static handleBatchOperationResults(results: Array<{success: boolean; message: string}>): void {
    const failed = results.filter(r => !r.success);
    if (failed.length > 0) {
      this.showWarning('操作结果', `部分操作失败: ${failed.length} 个错误`);
      failed.forEach(f => this.showError('错误', f.message));
    }
  }
}