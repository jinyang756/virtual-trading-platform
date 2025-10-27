interface QueuedRequest {
  resolve: (value: any) => void;
  reject: (error: any) => void;
  config: any;
}

class RequestQueue {
  private isRefreshing = false;
  private failedQueue: QueuedRequest[] = [];

  processQueue(error: any = null) {
    this.failedQueue.forEach(request => {
      if (error) {
        request.reject(error);
      } else {
        request.resolve(request.config);
      }
    });
    this.failedQueue = [];
  }

  enqueue(request: QueuedRequest) {
    this.failedQueue.push(request);
  }

  get refreshing() {
    return this.isRefreshing;
  }

  set refreshing(value: boolean) {
    this.isRefreshing = value;
  }
}

export const requestQueue = new RequestQueue();