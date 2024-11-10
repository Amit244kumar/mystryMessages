import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema=z.object({
    username:usernameValidation,
})

export async function GET(request:Request){


    await dbConnect()

    try {
        const {searchParams}=new URL(request.url)
        const queryParam={
            username:String(searchParams.get('username'))
        }
        // validation with zod
        const result=UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if(!result.success){
            const usernameErrors=result.error.format()
            .username!._errors || []
            return Response.json({
                 success:false,
                 message:usernameErrors?.length > 0
                 ? usernameErrors.join(','):
                 'Invalid query parameters',
            },{status:400})
        }


        console.log(result.data)
        const {username}=result.data
         
        const existingVerifyUser= await UserModel.findOne({username,isVerified:true})
        
        if(existingVerifyUser){
            return Response.json({
                success:false,
                message:"username is already taken"
           },{status:400})
        }else{
            return Response.json({
                success:true,
                message:"username is available"
           },{status:200})
        }
    } catch (error) {
        console.error("Error checking username",error)
        return Response.json({
            success:false,
            message:"Error checking username"
        },{status:500})
    }
}