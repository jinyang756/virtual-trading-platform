import { useState, useEffect } from 'react';

// 验证码倒计时持久化 key
const COUNTDOWN_STORAGE_KEY = 'verify-code-countdown';

interface CountdownState {
  endTime: number;
  phone: string;
}

export function useCountdown(initialSeconds: number = 60) {
  const [countdown, setCountdown] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  // 初始化时从localStorage恢复倒计时状态
  useEffect(() => {
    const saved = localStorage.getItem(COUNTDOWN_STORAGE_KEY);
    if (saved) {
      const state: CountdownState = JSON.parse(saved);
      const remaining = Math.ceil((state.endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setCountdown(remaining);
        setIsActive(true);
      } else {
        localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
      }
    }
  }, []);

  // 处理倒计时
  useEffect(() => {
    let timer: number;
    if (isActive && countdown > 0) {
      timer = window.setInterval(() => {
        setCountdown(prev => {
          const next = prev - 1;
          if (next <= 0) {
            setIsActive(false);
            localStorage.removeItem(COUNTDOWN_STORAGE_KEY);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, [isActive, countdown]);

  // 启动新的倒计时
  const startCountdown = (phone: string) => {
    const endTime = Date.now() + initialSeconds * 1000;
    setCountdown(initialSeconds);
    setIsActive(true);
    
    // 保存到 localStorage
    const state: CountdownState = { endTime, phone };
    localStorage.setItem(COUNTDOWN_STORAGE_KEY, JSON.stringify(state));
  };

  return {
    countdown,
    isActive,
    startCountdown
  };
}