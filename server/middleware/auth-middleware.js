const jwt = require("jsonwebtoken")

const authMiddleware = async(req, res, next) => {

    const token = req.header("Authorization")

    if(!token){
        res.status(500).json({msg: "Unauthorized Request. Please Authorize"})
    }
    const jwtToken = token.replace("Bearer", "").trim()

    try {
        const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
        if(isVerified){
            req.id = isVerified.userId
            console.log("done")
            return next()
        }
    } catch (error) {
        next(error)
    }
}

module.exports = authMiddleware