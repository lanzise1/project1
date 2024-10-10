"use client";
import { useChatInput } from "@/app/hooks/chat/useChatInput";
import { useChatMessage } from "@/app/hooks/chat/useChatMessage";
import { completionsApi } from "@/request";
import Send from "./send";
import Message from "./message";

export default function Home() {
  const { inputValue } = useChatInput();
  const { updateMessage, createChatMessage } = useChatMessage();

  const sendMsg = async ({msg,file}:TSendMsgProps) => {
    let userMessage = {
      role: 'user',
      text: msg,
    };
    let AiMessage = {
      role: 'assistant',
      text: '',
    };
    createChatMessage(userMessage);
    let assistantId = createChatMessage(AiMessage);
    try {
      const result = await completionsApi({
        model: 'meta/llama-3.1-405b-instruct',
        prompt: msg,
        stream: true,
      });

      if (result.stream) {
        for await (const chunk of result.data) {
          if (chunk === 'done') {
            return;
          }
          // console.log(assistantId, 'iiiiiiiii');
          let data = {
            id: assistantId,
            text: chunk
          };
          updateMessage(data);
        }
      } else {
        // console.log('bbbbbbbbbbbb', result);
        // Handle non-streaming response
      }
    } catch (error) {
      // console.error('Error:', error);
    }
  };

  return (
    <div>
      <Send sendMsg={sendMsg} />
      <p>this is hooks's state {inputValue}</p>
      <Message />
    </div>
  );
}
    