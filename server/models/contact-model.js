const mongoose = require("mongoose")

const contactSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    place: {
        type: String,
        require: true
    },
    id: {
        type: String,
        require: true
    },
    favorite: {
        type: String,
        require: true
    }
})


const Contacts = new mongoose.model("Contact", contactSchema)

module.exports = Contacts