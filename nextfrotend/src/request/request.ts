export const API_URL = process.env.NEXT_PUBLIC_API_URL

class FetchWrapper {
  private baseURL: string;
  private defaultConfig: RequestConfig;
  private interceptors: InterceptorHandlers = {
    request: config => config,
    requestError: error => Promise.reject(error),
    response: response => response,
    responseError: error => Promise.reject(error)
  };

  constructor(baseURL: string = '', defaultConfig: RequestConfig = {}) {
    this.baseURL = baseURL;
    this.defaultConfig = defaultConfig;
  }

  public setInterceptors(handlers: Partial<InterceptorHandlers>) {
    this.interceptors = { ...this.interceptors, ...handlers };
  }

  private async request<T>(url: string, method: Method, config: RequestConfig = {}): Promise<T> {
    const fullURL = this.baseURL + url;
    let mergedConfig: RequestConfig = {
      ...this.defaultConfig,
      ...config,
      method,
      headers: {
        ...this.defaultConfig.headers,
        ...config.headers,
      },
    };
    // Apply request interceptor
    try {
      mergedConfig = await this.interceptors.request(mergedConfig);
    } catch (error) {
      return Promise.reject(this.interceptors.requestError(error));
    }

    // Handle query parameters
    if (mergedConfig.params) {
      const queryParams = new URLSearchParams(mergedConfig.params).toString();
      url += (url.includes('?') ? '&' : '?') + queryParams;
    }

    // 处理 body 数据
    if (!(mergedConfig.body instanceof FormData) && typeof mergedConfig.body === 'object') {
      mergedConfig.body = JSON.stringify(mergedConfig.body);
      mergedConfig.headers = {
        'Content-Type': 'application/json',
        ...mergedConfig.headers,
      };
    }

    // 如果是 FormData，不设置 Content-Type，让浏览器自动设置
    if (mergedConfig.body instanceof FormData) {
      if (mergedConfig.headers) {
        delete mergedConfig.headers['Content-Type'];
      }
    }

    try {
      let response = await fetch(fullURL, mergedConfig);
      // 检查网络请求状态
      if (!response.ok) {

        // 解析响应数据并处理接口返回错误
        const errorData = await response.json();
        console.log(`output->errorData5555555555`, errorData)
        return Promise.reject({
          message: errorData.error || '',
          details: errorData,
          status: response.status,
        })
      }

      // 处理响应成功的数据
      const data = await response.json();
      return data as T;
    } catch (error: any) {
      return Promise.reject(this.interceptors.response(error));
    }
  }

  public get<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, 'GET', config);
  }
  public post<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request<T>(url, 'POST', { ...config, body });
  }
  public put<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, 'PUT', { ...config, body: JSON.stringify(data) });
  }

  public delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, 'DELETE', config);
  }

  public patch<T>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(url, 'PATCH', { ...config, body: JSON.stringify(data) });
  }
}

// 使用示例
const customFetch = new FetchWrapper(API_URL);


// 设置拦截器
customFetch.setInterceptors({
  request: (config) => {
    // 在发送请求之前做些什么
    return config;
  },
  requestError: (error) => {
    // 处理请求错误
    return {
      message: '请求错误',
      details: error.message,
      status: error.status || 500
    };
  },
  response: async (response) => {
    // 在收到响应之后做些什么
    console.log(response, 'error111111')

    if (!response.ok) {
      const error =  response
      // 处理接口状态
      throw {
        message: error || '接口状态',
        details: error,
        status: response.status
      };
    }
    return response;
  },
});
// 流式处理的生成器函数
export async function* streamResponse(response: Response): AsyncGenerator<string, void, unknown> {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        yield 'done';
        break
      }
      yield decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }
}

export default customFetch