import  {resend} from '@/lib/resend'
import VerificationEmail from '../../emails/verificationEmail'
import { ApiResponse } from '@/models/type/APIResponse'



export async function sendVerificationEmail(email:string,username:string,verifyCode:string)
:Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'madate5544@advitize.com',
            to: email,
            subject: 'Mistry message | Verication Code ',
            react: VerificationEmail({username,otp:verifyCode}),
          });
          console.log("data",data,"error",error)
        return {success:true,message:"verification email send successfully"}
        
    } catch (emailError) {
        console.log("Error sending verification email",emailError)
        return {success:false,message:"failed to send varication email"}
    }
}