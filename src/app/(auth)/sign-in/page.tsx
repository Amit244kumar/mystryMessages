'use client'
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useDebounceCallback } from 'usehooks-ts'

import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/type/APIResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'

const page=() =>{
  
  const [isSubmitting,setIsSubmiting]=useState(false)
  const {toast}=useToast()
  const router = useRouter()
  // zod implementation
  const form= useForm<z.infer<typeof signInSchema>>({
    resolver:zodResolver(signInSchema),
    defaultValues:{
      email:"",
      username:"",
      password:""
    }
  })


  const onSubmit = async (data:z.infer<typeof signInSchema>) =>{
    setIsSubmiting(true)
    const result=await signIn('credentials',{
          redirect:false,
          identifier:data.identifier,
          password:data.password
    })

    if(result?.error){
        if(result.error == 'CredentialsSignin'){
            toast({
                title:"Login Failed",
                description:"Incorrect username or password",
                variant:"destructive"
            })
        }else{
            toast({
                title:"Error",
                description:result.error,
                variant:"destructive"
            })
        }
    }

    if(result?.url){
        router.replace('/dashboard')
    }
    setIsSubmiting(false)
  }

  return (
    <div className='flex justify-center
     items-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-8
         space-y-8 bg-white rounded-lg shadow-md'>
          <div className='text-center'>
              <h1 className='text-4xl font-extrabold tracking-tight
              lg:text-5xl mb-6'>
                    join Mystery Message
              </h1>
              <p className='mb-4'>Sign up to start your anonymous adventure</p>

          </div>
          <div>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                 className='space-y-6'
                >
                      <FormField
                        control={form.control}
                        name="identifier"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email/Username</FormLabel>
                            <FormControl>
                              <Input type='email' name='email' placeholder="email/username" 
                              {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Password" 
                              {...field} 
                              
                              />
                            </FormControl>
                            <FormDescription>
                              
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  <Button className='w-full' type="submit">Sign In</Button>
                </form>
             </Form>
             <div className='text-center mt-4'>
              <p>
                      Create Account{' '}
                      <Link href="/sign-up" className='text-blue-600
                      hover:text-blue-800'>
                        Sign Up
                      </Link>

              </p>

             </div>
          </div>
         </div>
     </div>
  )
}

export default page