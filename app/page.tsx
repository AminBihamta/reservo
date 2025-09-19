import React from 'react'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image'
import { redirect } from 'next/navigation';




export default async function UserPage() {

  const supabase = createClient(cookies());

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: rooms } = await supabase.from("rooms").select();
  return (
    <div className='flex flex-col min-w-screen'>

      <div className='flex flex-col gap-4 min-w-full'>
        <div className='flex flex-row min-w-full justify-between border p-2 items-center min-h-[50px] rounded-lg'>
          <p className='w-[50%] text-center'>Room Id</p>
          <p className='w-[50%] text-center pr-[60px]'>Room Name</p>
        </div>

        {rooms?.map((room) => (
          <div key={room.id}>
            <div className='flex flex-row min-w-full justify-between border p-2 align-middle items-center rounded-lg min-h-[50px]' >
              <p className='w-[50%] text-center'>{room.id}</p>
              <p className='w-[50%] text-center'>{room.id}</p>
              <Link href={'/rooms/' + room.id}>
                <Button className="bg-neutral-900 border border-neutral-300 p-[10px] hover:bg-neutral-800">
                  <Image className="fill-red-200" src="/view-icon.svg" width={18} height={25} alt={""} />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div >
  )
}
