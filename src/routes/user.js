const router = require("express").Router()
const { createUser, deleteUser, loginUser } = require("../controllers/user")

router.route("/:id").delete(deleteUser)
router.route("/signup").post(createUser)
router.route("/login").post(loginUser)
//router.route("/signin").post()


module.exports = router