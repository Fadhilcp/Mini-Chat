import mongoose from "mongoose"
import env from 'dotenv'
env.config()


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('DB Connected')
    } catch (error) {
        console.log('DB Connection error')
        process.exit()
    }
}

export default connectDB