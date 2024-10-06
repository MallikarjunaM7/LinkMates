const Users = require("../models/user-model")

const followerMiddleWare = async(req, res, next) => {
    console.log("Hiiii")
    const {myUsername, oppUsername} = req.body
    try {
        const myFollowing = await Users.findOne({username: myUsername}, {_id: 0, Following: 1})
        console.log(myFollowing.Following)
        if(myFollowing.Following && myFollowing.Following.includes(oppUsername)){
            return next()
        }else{
            const status = 500;
            const message = "Request Error";
            const extraDetails = "Your are not Following this User"
            const tryerror = {status, message, extraDetails}
            next(tryerror)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = followerMiddleWare