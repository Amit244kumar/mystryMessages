'use client'

import React from 'react'
import Link from 'next/link'
import { useSession,signOut} from 'next-auth/react'
import {User} from 'next-auth'
import { Button } from '@react-email/components'


export default function NavBar() {

  const {data:session}=useSession()  
  const user:User =session?.user as User

  return (
    <nav className='p-4 md:p-6 shadow-md'>
        <div className='container mx-auto flex flex-col 
        mad:flex-row justify-between items-center'>
            <a href="#" className='text-xl font-bold mb-4 md:mb-0
            '>Mystry Message</a>
            {
                session?(
                    <>
                        <span className='mr-4'>Welcome, {user?.username || user?.email}</span>
                        <Button className='w-full md:w-auto' onClick={()=>signOut()}>Logout</Button>
                    </>
                ):(
                    <Link href='/sign-in'>
                        <Button className='w-full md:w-auto' >Login</Button>
                    </Link>
                )
            }
        </div>
    </nav>
  )
}
