import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

// Create an openAI api client (that's edge friendly!)
const openai =new OpenAI({
    apiKey:process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(req:Request){
    try {
        const promt=' '
        const {messages}=await req.json();
 
        // Ask OpenAI for a streaming chat completion given the promt
        const response=await openai.chat.completions.create({
            model:'gpt-3.5-turbo-instruct',
            max_tokens:40,
            stream:true,
            prompt,
        })
        // Convert the response into a friendly text-stream
        const stream =OpenAIStream(response)
        // Respond with the stream
        return new StreamingTextResponse(stream)
    } catch (error) {
        if(error instanceof OpenAI.APIError){
            const {name,status,headers,message}=error
            return NextResponse.json({
                name,status,headers,message
            },{status})
        }else{
            console.error("an unexpected error occured")
            throw  error
        }
    }

}