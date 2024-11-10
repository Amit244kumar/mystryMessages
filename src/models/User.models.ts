import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt:Date,
}

const MessageSChema:Schema<Message> = new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    messages:Message[]
}

const USerSChema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/.+\@.+\..+/,"please use valid email address"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        verifyCodeExpiry:[true,"verify code Expiry is required"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false
    },
    messages:[MessageSChema]
})


const UserModel = (mongoose.models.User as mongoose.Model<User>) 
               || mongoose.model<User>("User",USerSChema)
               
export default UserModel;