import customFetch from "./request";
import { streamResponse } from './request'
interface TCompletions {
  content: string;
}

interface RequestCompletionsBody {
  prompt: string;
  stream?: boolean;
  model: string;
  // 其他可能的参数...
}

interface StreamResponse {
  stream: true;
  data: AsyncGenerator<string, void, unknown>;
}

interface NonStreamResponse {
  stream: false;
  data: TResponse<TCompletions>;
}

export interface TpyChatParams {
  msg: string
  fileId?:string
}
interface TpyChatResponse {
  response: string

}

type CompletionsApiResponse = StreamResponse | NonStreamResponse;

export const completionsApi = async (data: RequestCompletionsBody): Promise<CompletionsApiResponse> => {
  if (data.stream) {
    const response = await fetch("/api/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      stream: true,
      data: streamResponse(response)
    };
  } else {
    const response = await customFetch.post<TResponse<TCompletions>>("/api/chat/completions", data);
    return {
      stream: false,
      data: response
    };
  }
};


export const pyChatApi = (data: TpyChatParams) => {
  return customFetch.post<TpyChatResponse>("/pyapi/chat", data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
