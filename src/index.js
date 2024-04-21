const express = require("express")
const cors = require("cors")
const path = require("path")
const jwt = require("jsonwebtoken")
const connectToDB = require("./connection_db")

//import routers
const productRouter = require("./routes/product")
const orderRouter = require("./routes/order")
const userRouter = require("./routes/user")




const app = express()


app.use(cors())
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))


app.use("/", userRouter)
app.use((req, res, next) => {
    console.log(req.headers.authorization)
    try{
        const decoded = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY)
        console.log(decoded)
        next()
    }catch(err){
        console.log("ERROR AT MIDDLEWARE", err)
        return res.status(401).json({message: "Unauthorized Access"})
    }
})
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)


connectToDB().then(() => {
    app.listen(3000, () => {
        console.log("Server is running...")
    })
})

