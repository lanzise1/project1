type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig extends RequestInit {
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

interface InterceptorHandlers {
  request: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  requestError: (error: any) => any;
  response: (response: Response) => Response | Promise<Response>;
  responseError: (error: any) => any;
}

interface TResponse<T> {
  message: string;
  code: number;
  data: T;
}
