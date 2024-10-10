"use client"
import Link from "next/link";
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent, ChangeEvent } from "react";
import { userRegisterApi } from "@/request"
import { useUserInfo } from "../hooks/auth/useUserInfo";
import { useToast } from "@/context";
import { debounce } from "@/utils/debounce"

interface FormData {
  username: string
  password: string
}
const initFormData = {
  username: '',
  password: '',
}

export default function Home() {
  const router = useRouter()
  const showToast = useToast()
  const [formData, setFormData] = useState<FormData>(initFormData);
  const { updateUserInfoVal } = useUserInfo()
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const goRegister = debounce(async () => {
    try {
      const res = await userRegisterApi(formData)
      updateUserInfoVal(res.data)
      showToast('info', 'Info', res.message);
      router.push('/')
    } catch (error) {
      console.log(error, 'eeeeeeeeeeeer')
    }
  }, 200)
  const debouncedRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认事件
    goRegister()
  }
  return (
    <div className="flex justify-center flex-col items-center">
      <h1>register here</h1>
      <form onSubmit={debouncedRegister} className="flex flex-col justify-center gap-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <InputText name="username" onChange={handleChange} value={formData.username} placeholder="Username" />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <InputText name="password" onChange={handleChange} value={formData.password} placeholder="Password" />
        </div>
        <Button type="submit" className="mx-auto" >toReg</Button>
      </form>

      <Link href="/login">go login</Link>
    </div>
  );
}
