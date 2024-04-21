const router = require("express").Router()
const path = require("path")
const multer = require("multer")
//multerfication charot
const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" ){
            cb(null, 'src/uploads/')
        }else{
            cb(new Error("Invalid file format"), null)
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()+Math.round(Math.random() * 1000)}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })

const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product")

router.route("/").get(getProducts).post(upload.single("product_photo"), ((err, req, res, next) => {
    if(err) return res.status(400).json({message: err.message})
    next()
}), addProduct)
router.route("/:id").get(getProduct).delete(deleteProduct).patch(updateProduct)

module.exports = router

