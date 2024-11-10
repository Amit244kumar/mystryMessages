import { getServerSession } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models"
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(request:Request){
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User=session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:400})
    }
    const userId=user._id
    const {acceptMessages}=await request.json()
    
    try {
        const updateUser=await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessages})
        if(!updateUser){
            return Response.json({
                success:false,
                message:"failed to update user status to accept messages"
            },{status:401})
        }
        

        return Response.json({
            success:true,
            message:"message acceptance status update successfully"
        },{status:200})

    } catch (error) {
        console.log("failed to update user status to accept message")
        return Response.json({
            success:false,
            message:"Fail to update user status to accept message"
        },{status:500}) 
    }

}

export async function GET(request:Request) {
    await dbConnect()

    const session=await getServerSession(authOptions)
    const user:User=session?.user as User

    if(!session || !session.user){
        return Response.json({
            success:false,
            message:"Not Authenticated"
        },{status:400})
    }
    const userId=user._id   

    try {
        const foundUser=await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:404})
        }
        return Response.json({
            success:true,
            IsAcceptingMessages:foundUser.isAcceptingMessage
        },{status:200})
    } catch (error) {
        return Response.json({
            success:false,
            message:"Error is getting message acceptance status"
        },{status:400})
    }
   
}