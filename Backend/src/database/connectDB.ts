import dataSource from "./datasource";

export const connectDB = async()=>{
    try{
        await dataSource.initialize()
        console.log("Connected to DataBase.");
    }
    catch(error){
        console.log("Connection to DB failed...",error);
    }
}