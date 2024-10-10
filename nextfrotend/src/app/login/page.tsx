"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useToast } from "@/context";
import { userLoginApi } from "@/request"
import { debounce } from "@/utils"
import { useUserInfo } from "../hooks/auth/useUserInfo";
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
  const goLogin = debounce(async () => {
    try {
      const res = await userLoginApi(formData)
      updateUserInfoVal(res.data)
      showToast('info', 'Info', res.message);
      router.push('/')
    } catch (error) {
      console.log(error, 'eeeeeeeeeeeer')
    }
  }, 200)
  const debouncedLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 阻止默认事件
    goLogin()
  }
  return (
    <div className="flex justify-center flex-col items-center">
      <h1>Login here</h1>
      <form onSubmit={debouncedLogin} className="flex flex-col justify-center gap-3">
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-user"></i>
          </span>
          <input name="username" onChange={handleChange} value={formData.username} placeholder="Username" />
        </div>
        <div className="p-inputgroup flex-1">
          <span className="p-inputgroup-addon">
            <i className="pi pi-lock"></i>
          </span>
          <input name="password" onChange={handleChange} value={formData.password} placeholder="Password" />
        </div>
        <button type="submit" className="mx-auto" >toLogin</button>
      </form>

      <Link href="/register">go register</Link>
    </div>
  );
}
