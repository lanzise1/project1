import Groq from "groq-sdk";
import { ReadableStream } from "stream/web";


// Define the interface for non-stream completion
interface NonStreamCompletion {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function groqEndpoint({
  model,
  prompt,
  temperature,
  top_p,
  max_tokens,
  stream,
}: RequestCompletionsBody): Promise<{ content: string } | ReadableStream> {
  console.log(`output->gggggggggggggg`,model);
  try {
    const completion = await groq.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature,
      top_p,
      max_tokens,
      stream,
    });

    if (stream) {
      return completion as unknown as ReadableStream;
    } else {
      const nonStreamCompletion = completion as NonStreamCompletion;
      const content = nonStreamCompletion.choices[0]?.message?.content || "";
      return { content };
    }
  } catch (error) {
    console.error("Error in groqEndpoint:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}