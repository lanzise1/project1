"use client"
import { useState } from "react";
import {TpyChatParams,pyChatApi} from '@/request'
import Message from '@/app/chat/message'
import { useChatMessage } from "@/app/hooks/chat/useChatMessage";
import Send from "../chat/send";
import TypingEffect from "./typeffect"; 
export default function Agent() {
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
    console.log(msg, '11111111',file)
    let params:TpyChatParams = {
      msg
    }
    if(file){
      params = {
        msg,
        fileId:file,
      }
    }
    createChatMessage(userMessage);
    let assistantId = createChatMessage(AiMessage);
    try {
      const res = await pyChatApi(params);
      let data = {
        id: assistantId,
        text: res.response
      };
      updateMessage(data);
    } catch (error) {
      console.log('erroraaaaaaaaaaaaaaaaaaa',error)
    }
  }
  return (
    <div>
      <Send sendMsg={sendMsg} />
      <TypingEffect text="Hello, how are you today?" />
      <div className=" w-full flex justify-center p-4">
      <Message />
      </div>
    </div>
  );
}
