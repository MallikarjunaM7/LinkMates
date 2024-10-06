const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    feedback: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    }
})


const Feedbacks = new mongoose.model("Feedback", feedbackSchema)

module.exports = Feedbacks