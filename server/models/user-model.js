const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    RequestsYouGot: {
        type: Array,
        default: []
    },
    RequestsYouSent: {
        type: Array,
        default: []
    },
    Following: {
        type: Array,
        default: []
    },
    Followers: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
})

userSchema.methods.generateToken = async function() {
    try {
        return jwt.sign({
            userId : this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin
        },
        process.env.JWT_SECRET_KEY,
        {expiresIn: "30d"}
    )
    } catch (error) {
        console.log(error)
    }
}

userSchema.methods.compare = async function(password) {
    try {
        return bcrypt.compare(password, this.password)
    } catch (error) {
        console.log(error)
    }
}

const Users = new mongoose.model("User", userSchema)

module.exports = Users