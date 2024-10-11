"use client"
import React, { useRef, MouseEvent } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Portal,
  Avatar
} from '@chakra-ui/react'
import { AiOutlineUser } from 'react-icons/ai'
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
    <Popover>
      <PopoverTrigger>
      <Avatar bg='red.500' icon={<AiOutlineUser fontSize='1.5rem' />} />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Header</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Button colorScheme='blue'>Button</Button>
          </PopoverBody>
          <PopoverFooter>This is the footer</PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}
