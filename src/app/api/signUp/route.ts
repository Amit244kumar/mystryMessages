import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";




export async function POST(request:Request){
    
    await dbConnect()
    
    try {
        const {username,email,password}=await request.json()

        const existingUserVerifiedByUsername=await UserModel.findOne({username,isVerified:true})

        // returning response to user if username is already exist and also verify 
        if(existingUserVerifiedByUsername){
            return Response.json(
                {success:false,message:"User is already taken"},
                {status:400}
            )
        }


        const existingUserByEmail=await UserModel.findOne({email})
        const verifyCode=Math.floor(10000+Math.random()*90000).toString()

        // Now Checking if user email is already exist or not
        if(existingUserByEmail){
            // email exist and also verified
           if(existingUserByEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User already register with this email"
                },{status:400})
           }else{
            // email exist but not verified
            const hashPassword=await bcrypt.hash(password,10)
            existingUserByEmail.password=hashPassword
            existingUserByEmail.verifyCode=verifyCode
            existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
            await existingUserByEmail.save()
           }
        }else{
            // code for sign up user 
            const hashPassword=await bcrypt.hash(password,10)
            const expiryDate= new Date()
            expiryDate.setHours(expiryDate.getHours()+1)
            const newuser=new UserModel({
                username,
                email,
                password:hashPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessage:true,
                messages:[]
            })
            await newuser.save()
        }
        // send verification email
        const emailResponse= await sendVerificationEmail(email,username,verifyCode)

        if(!emailResponse.success){
            return Response.json( {success:false,message:emailResponse.message},{
                status:500
            })
        }
      
        return Response.json( {success:true,message:"user register successfully.Please verify email "},{
            status:200
        })
         
    } catch (error) {
        console.log("Error registering User",error)
        return Response.json({
            success:false,
            message:"Error registering user"
        },{status:500})
    }
}