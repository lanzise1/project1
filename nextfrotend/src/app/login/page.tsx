"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent } from "react";
import { useToast, Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text, InputGroup, InputRightElement } from "@chakra-ui/react";
import { userLoginApi } from "@/request"
import { debounce } from "@/utils"
import { UseLocalStorageUtil } from "@/utils"
import { useUserInfo } from "../hooks/auth/useUserInfo";

interface FormData {
  username: string
  password: string
}

const initFormData = {
  username: '',
  password: '',
}

export default function Login() {
  const router = useRouter()
  const toast = useToast()
  const useLocalStorage = new UseLocalStorageUtil()
  const [formData, setFormData] = useState<FormData>(initFormData);
  const { updateUserInfoVal } = useUserInfo()
  const [errors, setErrors] = useState<{username?: string, password?: string}>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormData = initFormData;
    // 用户名判断username
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
      isValid = false;
    }

    // 密码判断password
    if (!formData.password) {
      newErrors.password = '密码不能为空';
      isValid = false;
    } 

    setErrors(newErrors);
    return isValid;
  };

  const goLogin = debounce(async () => {
    if (!validateForm()) return;

    try {
      const res = await userLoginApi(formData)
      updateUserInfoVal(res.data)
      toast({
        title: "Info",
        description: res.message,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      router.push('/')
    } catch (error) {
      console.log(error, 'eeeeeeeeeeeer')
    }
  }, 200)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goLogin()
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  return (
    <div className="flex justify-center items-center h-screen bg-[#F3F4F6]">
      <Box width="400px" p={4} bg="white" className="rounded-md border border-gray-200" >
        <VStack spacing={4} align="stretch">
          <Heading as="h1" size="lg" textAlign="left">欢迎</Heading>
          <Text fontSize="base" color="gray.500" textAlign="left">请登录您的账户</Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel fontSize="base" color="black" textAlign="left">用户名</FormLabel>
                <Input name="username" onChange={handleChange} value={formData.username} placeholder="请输入用户名" />
                {errors.username && <Text color="red.500" fontSize="sm">{errors.username}</Text>}
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontSize="base" color="black" textAlign="left">密码</FormLabel>
                <InputGroup>
                  <Input 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    onChange={handleChange} 
                    value={formData.password} 
                    placeholder="请输入密码" 
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={togglePasswordVisibility}>
                      {showPassword ? "隐藏" : "显示"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.password && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full" fontSize="base" >登录</Button>
            </VStack>
          </form>
          <Text color="gray.500" textAlign="center" mt={4} mb={4}>
            还没有账号？ <Link href="/register" className="text-black">去注册</Link>
          </Text>
        </VStack>
      </Box>
    </div>
  );
}