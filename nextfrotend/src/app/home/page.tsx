"use client";
import { useRouter } from 'next/navigation';
import { menulist } from './menu'
export default function Home() {
  const router = useRouter()
  const handleNav = (item:menuItem) =>{
    router.push(item.url)
  }
  
  return (
    <div>
      <div className='flex gap-8'>
       
      </div>
    </div>
  );
}
