const express = require("express")
const authMiddleware  = require("../middleware/auth-middleware")
const followerMiddleWare = require("../middleware/follower-middleware")
const router = express.Router()
const realtionControllers = require("../controllers/relation-controllers")

router.route("/search").post(authMiddleware, realtionControllers.search)
router.route("/addrequest").patch(authMiddleware, realtionControllers.addRequest)
router.route("/deleterequest").post(authMiddleware, realtionControllers.deleteRequest)
router.route("/getnumber").post(authMiddleware, realtionControllers.getNumber)
router.route("/getrequests").post(authMiddleware, realtionControllers.getRequests)
router.route("/acceptrequest").patch(authMiddleware, realtionControllers.acceptRequest)
router.route("/getoppusernameinfo").post(authMiddleware, followerMiddleWare, realtionControllers.getOppUsernameInfo)
router.route("/rejectrequest").patch(authMiddleware, realtionControllers.rejectRequest)
router.route("/unfollow").patch(authMiddleware, realtionControllers.unfollow)
router.route('/removefollower').patch(authMiddleware, realtionControllers.removeFollower)

module.exports = router