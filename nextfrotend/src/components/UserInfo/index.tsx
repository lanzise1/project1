"use client"
import React, { useRef, MouseEvent } from 'react'
import { useUserInfo } from '@/app/hooks/auth/useUserInfo'
export default function Home() {
  const { userInfo } = useUserInfo()
  // 弹出用户信息

  // 退出登录
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    window.location.reload()
  }
  return (
    <div className="flex justify-center flex-col items-center">
        <div className=' w-40 h-40'>
          <p>
            {userInfo?.username}
          </p>
          <div className='flex justify-end'>
            <button  onClick={logout} />
          </div>
        </div>
    </div>
  );
}
