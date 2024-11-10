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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const page=() =>{
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingusername,setIsCheckingUsername]=useState(false)
  const [isSubmitting,setIsSubmiting]=useState(false)
  const debounce=useDebounceCallback(setUsername,300)
  const {toast}=useToast()
  const router = useRouter()
  // zod implementation
  const form= useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
      email:"",
      username:"",
      password:""
    }
  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(username){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {

          const response=await axios.get(`/api/check-username-unique?username=${username}`)

          let msg=response.data.message
          console.log(response)
          setUsernameMessage(msg)
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          const res=axiosError.response?.data.message ?? "Error checking username "
          setUsernameMessage(res)
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }


    checkUsernameUnique()
  },[username])

  const onSubmit = async (data:z.infer<typeof signUpSchema>) =>{
    setIsSubmiting(true)
    try {
      console.log(data)
      const response=await axios.post<ApiResponse>('/api/signUp',data)
      toast({
        title:'Success',
        description:response.data.message
      })
      router.replace(`/verify/${username}`)
      setIsSubmiting(false)
    } catch (error) {
      console.error("Error in sign up",error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title:"singup failed",
        description:errorMessage,
        variant:"destructive"
      })
      setIsSubmiting(false)
    }
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
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input type='text' placeholder="username" 
                              {...field} 
                              onChange={(e)=>{
                                field.onChange(e)
                                debounce(e.target.value)
                              }}
                              />
                            </FormControl>
                            {isCheckingusername && <Loader2 
                              className='animate-spin'
                              />}
                              <p className={`text-sm ${usernameMessage === "username is available"?
                                'text-green-600':'text-red-600'
                              }`}>
                                 {usernameMessage}
                              </p>
                            <FormDescription>
                              
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type='email' placeholder="Email" 
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
                      <Button type="submit" className='w-full' disabled={isSubmitting}>
                      {
                        
                        isSubmitting?(
                          <>
                           <Loader2 className='mr-2 h-4 w-4 
                           animate-spin' /> Please wait
                          </>
                        ):('Signup')
                      }
                  </Button>
                </form>
             </Form>
             <div className='text-center mt-4'>
              <p>
                      already a member?{' '}
                      <Link href="/sign-in" className='text-blue-600
                      hover:text-blue-800'>
                        Sign in
                      </Link>

              </p>

             </div>
          </div>
         </div>
     </div>
  )
}

export default page