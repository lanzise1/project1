import { NextRequest, NextResponse } from 'next/server';
import { groqEndpoint, openaiEndpoint } from '../llm'

export async function POST(request: NextRequest) {

    try {

        // 从请求体中解析JSON数据
        const body: RequestCompletionsBody = await request.json();

        // 从body中提取所需的值，使用解构赋值和默认值
        const {
            prompt,
            model,
            temperature = 0.2,
            top_p = 0.7,
            max_tokens = 1024,
            stream = false
        } = body;
        // 选择模型调用
        let modelFunction;
        switch (model) {
            case 'llama3-8b-8192':
                modelFunction = groqEndpoint;
                break;
            case 'meta/llama-3.1-405b-instruct':
                modelFunction = openaiEndpoint;
                break;
            default:
                throw new Error(`Unsupported model: ${model}`);
        }
        // 处理流式和非流式请求
        if (stream) {
            return await handleStreamRequest(modelFunction, { prompt, temperature, top_p, max_tokens,model  });
        } else {
            return await handleNonStreamRequest(modelFunction, { prompt, temperature, top_p, max_tokens ,model});
        }


    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request.' },
            { status: 500 }
        );
    }
}

// 处理非流式请求的函数
async function handleNonStreamRequest(modelFunction: Function, params: any) {
    // 调用相应的模型函数并返回结果
    return await modelFunction(params);
}

// 处理流式请求的函数
async function handleStreamRequest(modelFunction: Function, params: any) {
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await modelFunction({ ...params, stream: true });
          for await (const chunk of result) {
            if (typeof chunk === 'string') {
              // 处理直接返回字符串的情况（如 groqEndpoint）
              controller.enqueue(chunk);
            } else if (chunk.choices && chunk.choices[0]?.delta?.content) {
              // 处理 OpenAI 风格的响应
              controller.enqueue(chunk.choices[0].delta.content);
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });
    
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  }