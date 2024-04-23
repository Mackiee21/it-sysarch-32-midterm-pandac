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

module.exports = upload