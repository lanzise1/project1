import React, { useState } from 'react';
import UploadFile from "./UploadFile";
import ChatInput from "./ChatInput";
import { SendBtn } from "./SendBtn";
import {uploadFileApi} from '@/request'

interface SendProps {
  sendMsg: ({msg,file}:TSendMsgProps) => void;
}
export default function Send({ sendMsg }: SendProps) {
  const [fileID, setfileID] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>('');
  const formdata = new FormData()
  const handleFileSelect = async (file: File) => {
    formdata.append('file',file,file.name)
    const response = await uploadFileApi(formdata)
    setfileID(response.file_id)
    
  };
  const handleInputMsg = (newMsg: string) => {
    setMsg(newMsg);
  };
  const sendbtn = ()=>{
    const sendProps = {
      msg,
      file:fileID||null
    }
    sendMsg(sendProps)
  }

  return (
    <div className="flex bg-slate-500 items-center justify-between px-3 py-2 border-t">
      <UploadFile onFileSelect={handleFileSelect} />
      <ChatInput sendMsg={sendbtn} inputMsg={handleInputMsg} />
      <SendBtn sendMsg={sendbtn} />
    </div>
  );
}