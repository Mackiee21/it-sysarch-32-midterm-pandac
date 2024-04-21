const router = require("express").Router()
const { addOrder, getOrdersFOR_ADMIN, getOrders, deleteOrder } = require("../controllers/order")



router.route("/").post(addOrder).get(getOrdersFOR_ADMIN)
//get orders based on the product id returns list of orders under that product
router.route("/:product_id").get(getOrders)
router.route("/:order_id").delete(deleteOrder)



module.exports = router
