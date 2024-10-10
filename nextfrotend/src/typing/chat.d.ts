// 定义请求体的接口
interface RequestCompletionsBody {
    prompt: string;
    temperature?: number;
    top_p?: number;
    max_tokens?: number;
    stream:boolean;
    model:string,
}

interface TchatMessageItem {
    id:string;
    role:string;
    time:string;
    text:string
}

interface TSendMsgProps {
    msg:string,
    file:string |null
}
