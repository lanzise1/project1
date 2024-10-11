"use client"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent } from "react";
import { useToast, Box, VStack, Heading, FormControl, FormLabel, Input, Button, Text, InputGroup, InputRightElement } from "@chakra-ui/react";
import { userRegisterApi } from "@/request"
import { debounce } from "@/utils"

interface FormData {
  username: string
  password: string
  confirmPassword: string
}

const initFormData = {
  username: '',
  password: '',
  confirmPassword: '',
}

export default function Register() {
  const router = useRouter()
  const toast = useToast()
  const [formData, setFormData] = useState<FormData>(initFormData);
  const [errors, setErrors] = useState<{username?: string, password?: string, confirmPassword?: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    const newErrors: {username?: string, password?: string, confirmPassword?: string} = {};

    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = '密码不能为空';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度至少为6位';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const goRegister = debounce(async () => {
    if (!validateForm()) return;

    try {
      const res = await userRegisterApi(formData)
      toast({
        title: "成功",
        description: res.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push('/login')
    } catch (error) {
      console.log(error, 'eeeeeeeeeeeer')
    }
  }, 200)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    goRegister()
  }

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="flex justify-center items-center h-screen bg-[#F3F4F6]">
      <Box width="400px" p={4} bg="white" className="rounded-md border border-gray-200" >
        <VStack spacing={4} align="stretch">
        <Heading as="h1" size="lg" textAlign="left">欢迎</Heading>
        <Text fontSize="base" color="gray.500" textAlign="left">请注册您的账户</Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.username}>
                <FormLabel>用户名</FormLabel>
                <Input name="username" onChange={handleChange} value={formData.username} placeholder="请输入用户名" />
                {errors.username && <Text color="red.500" fontSize="sm">{errors.username}</Text>}
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>密码</FormLabel>
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
              <FormControl isInvalid={!!errors.confirmPassword}>
                <FormLabel>确认密码</FormLabel>
                <InputGroup>
                  <Input 
                    name="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    onChange={handleChange} 
                    value={formData.confirmPassword} 
                    placeholder="请再次输入密码" 
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={toggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? "隐藏" : "显示"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {errors.confirmPassword && <Text color="red.500" fontSize="sm">{errors.confirmPassword}</Text>}
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">注册</Button>
            </VStack>
          </form>
          <Text textAlign="center">
            已有账号？ <Link href="/login">去登录</Link>
          </Text>
        </VStack>
      </Box>
    </div>
  );
}