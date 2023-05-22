import mongoose from "mongoose";

const connectDB = async () => {
    try{
 
   console.log("conecting");
    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    });

    const url = `${connection.connection.host} : ${connection.connection.port}`;
    console.log("MongoDb connected in: " + url);

    }catch(err){
        console.log(`Error: ${err}`)
    }
}

export default connectDB;