"use client";
import React from 'react'
import Image from 'next/image'
import { LogoutButton } from './logout-button'
import { usePathname } from 'next/navigation';

function Header() {
    const pathname = usePathname();

    if (pathname.includes('signin') || pathname.includes('signup')) {
        return null;
    } else {

        return (
            <div className='mb-10 flex flex-row justify-between'>
                <Image src="/reservo-logo.svg" alt="Logo" width={150} height={50} />
                <LogoutButton />
            </div>
        )
    }
}

export default Header
