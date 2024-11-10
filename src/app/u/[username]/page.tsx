'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { MessageSchema } from '@/schemas/messageSchema'
import { ApiResponse } from '@/type/APIResponse'
import { zodResolver } from '@hookform/resolvers/zod'

import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {z} from 'zod'


export default function page() {
  const [isSendingmessage,setIsSendingmessage]=useState(false)
  const {toast}=useToast()
  const params=useParams<{username:string}>()
  const form=useForm<z.infer<typeof MessageSchema>>({
    resolver:zodResolver(MessageSchema)
  })

  const onSubmit=async (dat:z.infer<typeof MessageSchema>)=>{
    
    try {
      const response=axios.post<ApiResponse>('/api/send-messages',{
                            username:params.username,
                            content:dat.content
                          })
      console.log((await response).data)
      toast({
        title:'Success',
        description:(await response).data.message
      })

    } catch (error) {
      const axiosError =error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title:"failed",
        description:errorMessage,
        variant:"destructive"
      })
    }
  }
  
  return (
    <div className='flex justify-center
     items-start min-h-screen '>
        <div className='w-full max-w-5xl p-8
         space-y-8  rounded-lg shadow-md'>
          <div className='text-center'>
              <h1 className='text-4xl font-extrabold tracking-tight
              lg:text-5xl mb-6'>
                    Public Profile Link
              </h1>
              
           </div>
          <div>
             <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} 
                 className='space-y-6'
                >
                      <FormField
                        control={form.control}
                        name="content"
                        
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>send anonymous</FormLabel>
                            <FormControl>
                              <Input type='text'  placeholder="Enter message" 
                              {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                  <Button className='w-full' type="submit">send</Button>
                </form>
             </Form>
             
          </div>
         </div>
     </div>
  )
}
