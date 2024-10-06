const mongoose = require("mongoose")

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connect Successfull")
    } catch (error) {
        console.log(error)
        console.log("Database connection Failed");
        process.exit(0)
    }
}    

module.exports = connectDB