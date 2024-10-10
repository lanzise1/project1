"use client";
import { InputTextarea } from "primereact/inputtextarea"
import { useChatInput } from "@/app/hooks/chat/useChatInput";
interface ChatInputProps {
    inputMsg: (msg: string) => void;
    sendMsg: () => void;
}
export default function ChatInput({ inputMsg,sendMsg }: ChatInputProps) {
    const { inputValue, setInputValue } = useChatInput()
    const onchangeSendMsg = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target
        setInputValue(target.value)
        inputMsg(target.value)
    }
    const onKeyDownHandler =(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault(); // 阻止默认的换行行为
          sendMsg(); // 调用发送消息的回调函数
        }
      };
    
    return (
        <InputTextarea className="flex-1 mr-3" autoResize rows={1} value={inputValue} onKeyDown={onKeyDownHandler} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onchangeSendMsg(e)} />
    )
}