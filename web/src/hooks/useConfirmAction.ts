import React, { useState, useCallback } from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface UseConfirmActionOptions {
  title?: string;
  content?: string;
  okText?: string;
  cancelText?: string;
}

export function useConfirmAction<T extends (...args: any[]) => Promise<any>>(
  action: T,
  options: UseConfirmActionOptions = {}
) {
  const [loading, setLoading] = useState(false);

  const {
    title = '确认操作',
    content = '是否确认执行此操作？',
    okText = '确定',
    cancelText = '取消'
  } = options;

  const confirmAction = useCallback(
    (...args: Parameters<T>) => {
      return new Promise<ReturnType<T>>((resolve, reject) => {
        Modal.confirm({
          title,
          icon: React.createElement(ExclamationCircleOutlined),
          content,
          okText,
          cancelText,
          onOk: async () => {
            try {
              setLoading(true);
              const result = await action(...args);
              resolve(result as ReturnType<T>);
            } catch (error) {
              reject(error);
            } finally {
              setLoading(false);
            }
          },
          onCancel: () => {
            reject(new Error('用户取消操作'));
          }
        });
      });
    },
    [action, title, content, okText, cancelText]
  );

  return {
    loading,
    confirmAction
  };
}

// 使用示例：
/*
const YourComponent = () => {
  const { loading, confirmAction } = useConfirmAction(
    async (userId: string) => {
      await adminApi.deleteUser(userId);
    },
    {
      title: '删除用户',
      content: '确定要删除该用户吗？此操作不可恢复。'
    }
  );

  const handleDelete = async (userId: string) => {
    try {
      await confirmAction(userId);
      message.success('删除成功');
    } catch (error) {
      if (error.message !== '用户取消操作') {
        message.error('删除失败');
      }
    }
  };

  return (
    <Button loading={loading} onClick={() => handleDelete('123')}>
      删除
    </Button>
  );
};
*/