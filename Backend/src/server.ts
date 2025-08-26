import { log } from "console";
import app from "./app";
import { connectDB } from "./database/connectDB";


const PORT = 5100;

const startServer = async()=>{
   try{
    await connectDB();
    app.get("/",async(req,res)=>{
        res.json({msg:"hello"})
    })
    app.listen(PORT,()=>{
        console.log(`Server is running in http://localhost:${PORT} `);
    })
   }catch(err){
    console.error("Failed to start server:", err);
    process.exit(1); // Exit process with failure
   }
}

startServer();