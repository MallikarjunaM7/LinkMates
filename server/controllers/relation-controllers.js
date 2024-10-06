const Users = require("../models/user-model")

const search = async(req, res) => {
    const username = req.body.username.trim()
    const hisUsername = req.body.hisUsername.trim()
    console.log(username, hisUsername)
    if(hisUsername === username){
        return res.status(401).json({samemsg: "You cant Search Yourself"})
    }
    try {
        const searchedUser = await Users.findOne({username: username}, {username: 1, _id:0, RequestsYouGot: 1})
        const hisUsernameFollowing = await Users.findOne({username: hisUsername}, {_id: 0, Following: 1})
        var acceptedRequest = false;
        console.log("hisUsernameFollowers", hisUsernameFollowing.Following.includes(username))
        if(hisUsernameFollowing.Following.length != 0 && hisUsernameFollowing.Following.includes(username)){
            acceptedRequest = true
            return res.status(200).json({user: searchedUser.username, acceptedmsg: acceptedRequest})
        }
        var alreadySent = false;
        if(searchedUser && searchedUser.RequestsYouGot.includes(hisUsername)){
            alreadySent = true
        }
        if(!searchedUser){
            return res.status(401).json({nomsg: `Cant Find ${username}`})
        }
        console.log(searchedUser)
        return res.status(200).json({user: searchedUser.username, alreadySent: alreadySent})
    } catch (error) {
        console.log(error)
    }
}


const addRequest = async(req, res) => {
    const {fromUser, toUser} = req.body
    console.log(fromUser,"gdsfsd" ,toUser)
    try {
        const updateToUser = await Users.updateOne({username: toUser}, {$push: {RequestsYouGot: fromUser}})
        const updateFromUser = await Users.updateOne({username: fromUser}, {$push: {RequestsYouSent: toUser}})
        return res.status(200).json({sucmsg: `Request Sent to ${toUser}`})
    } catch (error) {
        console.log(error)
    }
}

const deleteRequest = async(req, res) => {
    
    const {fromUser, toUser} = req.body
    console.log("fromto", fromUser,"gggg" ,toUser)
    try {
        const backFromUser = await Users.findOne({username: fromUser}, {RequestsYouSent: 1})
        const backToUser = await Users.findOne({username: toUser}, {RequestsYouGot: 1})
        if(backFromUser && backFromUser.RequestsYouSent){
            const RequestsYouSentArray = backFromUser.RequestsYouSent
            const newRequestsYouSentArray = RequestsYouSentArray.filter(item => item != toUser)
            const updateRequestsSent = await Users.updateOne({username: fromUser}, {$set: {RequestsYouSent: newRequestsYouSentArray}})
        }
        if(backToUser && backToUser.RequestsYouGot){
            const RequestsYouGotArray = backToUser.RequestsYouGot
            const newRequestsYouGotArray = RequestsYouGotArray.filter(item => item != fromUser)
            const updateRequestsGot = await Users.updateOne({username: toUser}, {$set: {RequestsYouGot: newRequestsYouGotArray}})
        }
        return res.status(201).json({sucmsg: "Request Unsent"})
    } catch (error) {
        console.log(error);
    }
}

const getNumber = async(req, res) => {
    const {username} = req.body
    try {
        const user = await Users.findOne({username: username}, {RequestsYouGot: 1})
        if(user && user.RequestsYouGot){
            const RequestsYouGotArray = user.RequestsYouGot
            return res.status(200).json({nummsg: RequestsYouGotArray.length})
        }
    } catch (error) {
        console.log(error)
    }
}

const getRequests = async(req, res) => {
    const username = req.body.username;
    try {
        const userRequests = await Users.findOne({username: username}, {RequestsYouGot: 1, _id: 0})
        console.log(userRequests)
        if(userRequests.RequestsYouGot.length === 0){
            return res.status(200).json({noreqmsg: "No Requests Right Now"})
        }
        return res.status(200).json({sucmsg: userRequests.RequestsYouGot})
    } catch (error) {
        console.log(error);
    }
}

const acceptRequest = async(req, res) => {
    const {byUsername, myUsername} = req.body
    console.log("last ", byUsername, myUsername)
    try {
        const backMyUser = await Users.updateOne({username: myUsername}, {$push: {Followers: byUsername}})
        const backbyUser = await Users.updateOne({username: byUsername}, {$push: {Following: myUsername}})
        const backMyUserPull = await Users.updateOne({username: myUsername}, {$pull: {RequestsYouGot: byUsername}})
        const backbyUserPull = await Users.updateOne({username: byUsername}, {$pull: {RequestsYouSent: myUsername}})
        
        var iAmFollower = false
        var requested = false;
        const requestHeGot = await Users.findOne({username: byUsername}, {Followers: 1, RequestsYouGot: 1})
        if(requestHeGot.Followers && requestHeGot.Followers.includes(myUsername)){
            iAmFollower = true
        }else if(requestHeGot.RequestsYouGot && requestHeGot.RequestsYouGot.includes(myUsername)){
            requested = true
        }
        return res.status(200).json({sucmsg: "Request Accepted", iAmFollower: iAmFollower, requested: requested})
    } catch (error) {
        console.log(error)
    }
}

const getOppUsernameInfo = async(req, res) => {
    console.log("hiiii")
    const {oppUsername} = req.body;
    try {
        const oppUsernamInfo = await Users.findOne({username: oppUsername}, {_id: 0, username: 1, email: 1, phone: 1, Following: 1, Followers: 1})
        return res.status(200).json(oppUsernamInfo)
    } catch (error) {
        console.log(error)
    }
}

const rejectRequest = async(req, res) => {
    const {myUsername, toRejectUsername} = req.body
    try {
        const updateMyUser = await Users.updateOne({username: myUsername}, {$pull: {RequestsYouGot: toRejectUsername}})
        const updateToRejectUsername = await Users.updateOne({username: toRejectUsername}, {$pull: {RequestsYouSent: myUsername}})
        return res.status(200).json({sucmsg: "Request Rejected"})
    } catch (error) {
        consolee.log(error)
    }
}

const unfollow = async(req, res) => {
    const {userToUnfollow, myUsername} = req.body
    try {
        const updateFollowing = await Users.updateOne({username: myUsername}, {$pull: {Following: userToUnfollow}})
        const updateFollower = await Users.updateOne({username: userToUnfollow}, {$pull: {Followers: myUsername}})
        return res.status(200).json({sucmsg: `Unfollowed ${userToUnfollow} Successfully`})
    } catch (error) {
        console.log(error)
    }
}

const removeFollower = async(req, res) => {
    const {userToRemove, myUsername} = req.body
    try {
        const updateFollowing = await Users.updateOne({username: userToRemove}, {$pull: {Following: myUsername}})
        const updateFollower = await Users.updateOne({username: myUsername}, {$pull: {Followers: userToRemove}})
        return res.status(200).json({sucmsg: `${userToRemove} removed Successfully`})
    } catch (error) {
        console.log(error)
    }
}
module.exports = {
    search, 
    addRequest, 
    deleteRequest, 
    getNumber, 
    getRequests, 
    acceptRequest, 
    getOppUsernameInfo, 
    rejectRequest, 
    unfollow,
    removeFollower
}