const Users = require("../models/user-model")
const bcrypt = require("bcrypt")
const Contacts = require("../models/contact-model")
const ForgotOtps = require("../models/forgotOTP-model")
const Otps = require("../models/otp-model")
var nodemailer = require('nodemailer');
const Feedbacks = require("../models/feedback-model")
var username, email, phone, password;

const register = async(req, res) => {

    username = req.body.username;
    email = req.body.email;
    phone = req.body.phone;
    password = req.body.password;
    const otp = Math.floor(Math.random() * 9000) + 1000;
    const userEmail = await Users.find({email: email})
    const userUsername = await Users.find({username: username})
    if(userEmail.length != 0){
        return res.status(404).json({alreadymsg: "User already registered. Please Login"})
    }

    if(userUsername.length != 0){
        return res.status(404).json({alreadymsg: "Username Not Available"})
    }
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MY_EMAIL,
          pass: process.env.MY_PASSWORD
        }
      });
      
      var mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: 'Sending Email using Node.js',
        text: `Your otp is ${otp}`
      };
      
      transporter.sendMail(mailOptions, async function(error, info){
        if (error) {
          console.log(error);
        } else {
            const createOtp = await Otps.create({username, email, phone, password, otp})
            return res.status(200).json({msg: "Email Sent"})
        }
      });

    
}

const login = async(req, res) => {

    const {email, password} = req.body
    try {
        const user = await Users.findOne({email: email})

        if(!user){
            return res.status(500).json({msg: "Please Register"})
        }
        const userExist = await user.compare(password)
        console.log(userExist)
        if(userExist){
            return res.status(200).json({
                msg: "Logined Successfully",
                token: await user.generateToken(),
                userId: user._id
            })
        }else{
            return res.status(500).json({msg: "Wrong password"})
        }
    } catch (error) {
        console.log(error)
    }
}

const addContact = async(req, res) => {
    const {username, phone, place, favorite} = req.body
    const id = req.id
    console.log(id)
    try {
        const user = await Contacts.findOne({username: username, id: id})
        console.log(user)
        if(user){
            return res.status(400).json({msg: "Failed to add already username present"})
        }else{
            const userContactCreated = await Contacts.create({username, phone, place, id, favorite})
            return res.status(201).json(userContactCreated)
        }
    } catch (error) {
        console.log("error", error)
    }
}

const getContacts = async(req, res) => {
    try {
        const allContacts = await Contacts.find({id: req.id})
        console.log("allcon",allContacts)
        return res.status(200).json({loginId: req.id, allContacts: allContacts})
    } catch (error) {
        console.log(error)
    }
}

const deleteContactById = async(req, res) => {

    const id = req.params.id;

    try {   
        await Contacts.deleteOne({_id: id})
        return res.status(200).json("Deleted Successfully")
    } catch (error) {
        console.log(error)
    }
}

const findContacts = async(req, res) => {

    const {detail, field, id} = req.body

    try {
        const foundUsers = await Contacts.find({id: id, [field]: detail})
        if(foundUsers.length === 0){
            return res.status(200).json({nomsg: "No contacts Found"})
        }
        return res.status(200).json(foundUsers)
    } catch (error) {
        console.log(error)
    }
}

const getuserbyid = async(req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const userData = await Contacts.findOne({_id : id}, {_id: 0, __v: 0})
        return res.status(200).json(userData)
    } catch (error) {
        console.log(error)
    }
}

const updateUser = async(req, res) => {
    const {username, phone, place, id, favorite, oldName, oldPlace, oldPhone, oldFavorite} = req.body
    const data = {username, phone, place, favorite}
    console.log("req", req.body)
    if(username === oldName && phone === oldPhone && place === oldPlace && favorite === oldFavorite){
        return res.status(200).json({samemsg: "Same data cant be updated"})

    }
    
    else if(username === oldName && (phone != oldPhone || place != oldPlace || favorite != oldFavorite)){
        const updatedUser = await Contacts.updateOne({_id: id}, {$set: data})
        return res.status(200).json({halfmsg: "Successfully Updated"})
    }

    try {

        const isPresent = await Contacts.find({id: req.id, username: username})
        console.log(isPresent)
        if(isPresent.length != 0){
            return res.status(500).json({errmsg: "Username Exists: Change the Username"})
        }
        else{
            const updatedUser = await Contacts.updateOne({_id: id}, {$set: data})
            console.log(updatedUser)
            return res.status(200).json({sucmsg: "Successfully Updated"})
        }
    } catch (error) {
        console.log(error)
    }
}

const getFavorites = async(req, res) => {
    try {
        const id = req.id
        const favorites = await Contacts.find({id: id, favorite: "yes"})
        return res.status(200).json(favorites)
    } catch (error) {
        console.log(error)
    }
}

const getMyDetails = async(req, res) => {
    const id = req.id
    try {
        const myDetails =  await Users.findOne({_id: id}).select({password: 0, __v: 0, isAdmin: 0})
        const myContacts = await Contacts.find({id : id})
        res.status(200).json({mydetails: myDetails, number: myContacts.length})
    } catch (error) {
        console.log(error)
    }
}

const updateMainUser = async(req, res) => {
    console.log("hii")
    const {id, username, email, phone, oldUsername, oldEmail, oldPhone} = req.body
    console.log(id)
    const data = {username, email, phone}



    if(username === oldUsername && email === oldEmail && phone === oldPhone){
        return res.status(500).json({samemsg: "Same data cant be updated"})
    }

    if(username === oldUsername && email != oldEmail){
        const isPresent = await Users.findOne({email: email})
        if(isPresent){
            return res.status(500).json({ispresmsg: "Email already exits "})
        }
        const updateMainUser = await Users.updateOne({_id: id}, {$set: data})
        return res.status(200).json({halfmsg: "Updated Successfully"})
    }

    try {
        if(oldEmail != email){
            const isPresentEmail = await Users.findOne({email: email})
            if(isPresentEmail){
                return res.status(500).json({ispresmsg: "Email already exits "})
            }
        }
        if(username != oldUsername){
            const isPresentUsername = await Users.findOne({username: username})
            if(isPresentUsername){
                return res.status(500).json({ispresmsg: "Username Already Exits Please try Another one"})
            }
        }
    } catch (error) {
        console.log(error)
    }
    try {
        const updateMainUser = await Users.updateOne({_id: id}, {$set: data})
        res.status(200).json({halfmsg: "Updated Successfully"})
    } catch (error) {
        console.log(error)
    }
}

const changePassword = async(req, res) => {
    const id = req.id
    const {currentPassword, password, confirmPassword} = req.body

    const user = await Users.findOne({_id: id})
    const correctPasword = await user.compare(currentPassword)

    if(correctPasword){
        if(currentPassword === password){
            return res.status(401).json({samepassmsg: "Old Password and New password are same"})
        }
        else if(password === confirmPassword){
            try {
                const saltRounds = 10
                const hashedPassword = await bcrypt.hash(password, saltRounds)
                const passData = {password: hashedPassword}
                const updatePassword = await Users.updateOne({_id: id}, {$set: passData})
                return res.status(200).json({sucmsg: "Password Updated Successfully"})
            } catch (error) {
                console.log(error)
            }
        }else{
            return res.status(401).json({nomatchmsg: "Passwords Dont Match"})
        }
    }else{
        return res.status(401).json({wrongmsg: "Current Passord is Wrong"})
    }
}

const verifyOtp = async(req, res) => {
    const userOtp = req.body.otp
    const email = req.params.email
    console.log(userOtp, email)
    const users =  await Otps.find({email: email})
    const singleUser = users[users.length - 1]
    if(userOtp === singleUser.otp){
        try {
            await Otps.deleteMany({email: email})
            const saltRounds = 10
            console.log(password)
            const hashedPassword = await bcrypt.hash(singleUser.password, saltRounds)
    
            const userCreated = await Users.create({username: singleUser.username, email, phone: singleUser.phone, password: hashedPassword})
            return res.status(201).json({
                sucmsg: "OTP Verifired: Registered Successfully",
                userId: userCreated._id.toString()
            })
    
        } catch (error) {
            console.log(error)
        }
    }else{
        return res.status(500).json({inmsg: "OTP entered is Incorrect"})
    }
}

const FeedbackResponse = async(req, res) => {

    const {username, email, feedback, rating} = req.body;
    if(feedback.length < 15){
        return res.status(401).json({errmsg: "Feedback must contain more than 15 Characters"})
    }
    try {
        const feedbackFromDB = await Feedbacks.find({email: email})
        console.log(feedbackFromDB.length)
        if(feedbackFromDB.length >= 3){
            return res.status(401).json({limitmsg: "Feedback Limit crossed for this Account"})
        } 
        const createFeedback = await Feedbacks.create({username, email, feedback, rating})
        return res.status(201).json({sucmsg: "Feedback Submitted: Thank You"})
    } catch (error) {
        console.log(error)
    }

}

const getFeedback = async(req, res) => {
    try {
        const userFeedbacks = await Feedbacks.find({rating: {$gt: 2.5}}, {__v: 0, _id: 0})
        return res.status(200).json(userFeedbacks)
    } catch (error) {
        console.log(error)
    }
}

const forgotPassword = async(req, res) => {
    const {email} = req.body
    try {

        const isRegistered = await Users.findOne({email: email})
        if(!isRegistered){
            return res.status(500).json({notregmsg: `${email} isn't registered.Please Register!`})
        }
        const otp = Math.floor(Math.random() * 9000) + 1000;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MY_EMAIL,
              pass: process.env.MY_PASSWORD
            }
          });
          
          var mailOptions = {
            from: process.env.MY_EMAIL,
            to: email,
            subject: 'Sending Email using Node.js',
            text: `Your Reset otp is ${otp}`
          };
          
          transporter.sendMail(mailOptions, async function(error, info){
            if (error) {
              console.log(error);
            } else {
                const createOtp = await ForgotOtps.create({email, otp})
                return res.status(200).json({sucmsg: `Reset email Sent to ${email}`})
            }
          });  
    } catch (error) {
        console.log(error)
    }
}

const verifyOtpForgot = async(req, res) => {
    const {email, otp} = req.body
    try {
        const users =  await ForgotOtps.find({email: email})
        const singleUser = users[users.length - 1]
        console.log(users)
        if(singleUser.otp === otp){
            await ForgotOtps.deleteMany({email: email})
            return res.status(200).json({correctotpmsg: "OTP verified Successfully"})
        }else{
            return res.status(500).json({inmsg: "OTP entered is Incorrect"})
        }
    } catch (error) {
        console.log(error)
    }
}

const changeForgotPassword = async(req, res) => {
    const {password, confirmPassword, email} = req.body
    console.log("email", email)
    try {
        if(password != confirmPassword){
            return res.status(200).json({nomatchmsg: "Both the Passwords doesn't match"})
        }
        
        const user = await Users.findOne({email: email})
        console.log("email", user)
        const isSame = await user.compare(password)
        console.log(isSame)

        if(isSame){
            return res.status(500).json({oldpassmsg: "Your new password is Same as the Old one"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const updatePassword = await Users.updateOne({email: email}, {$set: {password: hashedPassword}})
        return res.status(200).json({sucmsg: "Password Changed Successfully"})

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    register, 
    login, 
    addContact, 
    getContacts, 
    deleteContactById, 
    findContacts, 
    getuserbyid, 
    updateUser, 
    getFavorites,
    getMyDetails,
    updateMainUser,
    changePassword,
    verifyOtp,
    FeedbackResponse,
    getFeedback,
    forgotPassword,
    verifyOtpForgot,
    changeForgotPassword
}