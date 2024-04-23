const router = require("express").Router()
const upload = require('../multer')

const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product")

router.route("/").get(getProducts).post(upload.single("product_photo"), ((err, req, res, next) => {
    if(err) return res.status(400).json({message: err.message})
    next()
}), addProduct)
router.route("/:id").get(getProduct).delete(deleteProduct).patch(updateProduct)

module.exports = router

