import mongoose from 'mongoose'

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Mongo DB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        console.log('Could not connect to MongoDB')
        process.exit(1)
    }
};

