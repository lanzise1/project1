import OpenAI from 'openai';
import type { Stream } from 'openai/streaming';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_URL,
});
// 定义非流式响应的接口
interface NonStreamResponse {
    content: string;
}

// 定义函数的返回类型
type OpenAIResponse = Stream<OpenAI.ChatCompletionChunk> | NonStreamResponse ;
export async function openaiEndpoint({
    model,
    prompt,
    temperature,
    top_p,
    max_tokens,
    stream
}: RequestCompletionsBody): Promise<OpenAIResponse> {
    console.log(`output->aaaaaaaaa`,model)
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: "user", content: prompt }],
            temperature,
            top_p,
            max_tokens,
            stream
        });

        if (stream) {
            return completion as Stream<OpenAI.ChatCompletionChunk>;
          } else {
            const nonStreamCompletion = completion as OpenAI.ChatCompletion;
            const content = nonStreamCompletion.choices[0]?.message?.content || '';
            return { content };
          }
    } catch (error) {
        console.error('OpenAI API error:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}