import { useChatMessage } from "@/app/hooks/chat/useChatMessage";
import { MarkdownContent } from '@/components'

export default function Message() {
    const { messageList } = useChatMessage()
    return (
        <div className="flex flex-col gap-2 max-w-[80vh]">
            {
                messageList.map((item,index) => (
                    <div key={index} className="flex ">
                        <p className="text-gray-500 w-20 text-right mr-4">{item.role}:</p>
                        <MarkdownContent content={item.text}  />
                    </div>
                ))
            }
        </div>
    )
}