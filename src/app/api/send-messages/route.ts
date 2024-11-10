import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";

import { Message } from "@/models/User.models";


export async function POST(request:Request){
    await dbConnect()
    
    const {username,content} = await request.json()
    console.log(username,content)
    try {
        const user=await UserModel.findOne({username})
        if(!user){
             return Response.json({
                success:false,
                message:"User not found"
             },{status:404})
        }

   
        // is user accepting messages
        
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User is not accepting the messages"
            },{status:403})

        }

        const newMessage={content,createAt:new Date()}
        user.messages.push(newMessage as Message);
        await user.save()
        return Response.json({
            success:true,
            message:"messages sent successfully"
        },{status:200})
    } catch (error) {
        console.log("unexpected error occur:",error)
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:401})
    }
}