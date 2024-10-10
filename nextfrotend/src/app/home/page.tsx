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
        {
          menulist.map((item, index) => (
            <div className=' hover:bg-[#ffffff26] transition-all' key={index} title={item.title}>
              <p
                className="m-2">
                {item.desc}
              </p>
              <button onClick={()=> handleNav(item)}>
                {item.btn}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}
