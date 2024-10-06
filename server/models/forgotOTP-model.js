const mongoose = require("mongoose")

const forgototpSchema = new mongoose.Schema({

    email: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
})


const ForgotOtps = new mongoose.model("ForgotOtp", forgototpSchema)

module.exports = ForgotOtps