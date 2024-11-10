import mongoose from "mongoose";


type connectionObject ={
    isConnected?:number
}

const connection:connectionObject = {}


export async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("already connected to databased")
        return 
    }
    
    try {
        const db=await mongoose.connect(process.env.MONGODB_URL!)
        console.log(db)

        connection.isConnected=db.connections[0].readyState
        
        console.log("database connecte sucessfully")
    } catch (error) {
        console.log("Database connection failed",error)
        process.exit()
    }
      
}