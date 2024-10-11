import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LOCAL_STORAGE_USER_INFO } from '@/config';
interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const token = typeof window !== 'undefined' ? localStorage?.getItem(LOCAL_STORAGE_USER_INFO) : null;

  useEffect(() => {
    const publicPaths = ['/login', '/register', '/']; // 不需要登录的公共路径
    const isPublicPath = publicPaths.includes(pathname);

    if (!token && !isPublicPath) {
      // 用户未登录且当前页面不是公共页面，重定向到登录页
      router.push('/login');
    } else if (token && (pathname === '/login' || pathname === '/register')) {
      // 用户已登录但访问的是登录或注册页，重定向到首页
      router.push('/');
    }
  }, [token, pathname, router]);

  return <>{children}</>;
};