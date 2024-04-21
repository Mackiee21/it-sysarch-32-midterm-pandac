const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

const createUser = async (req, res) => {
    try{
        const duplicated = await User.findOne({ email: req.body.email })
        if(duplicated) return res.status(409).json({message: "Email already taken"})
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const createdUser = await User.create({
            email: req.body.email,
            password: hashedPassword
        })
        const token = jwt.sign({
            email: createdUser.email,
            password: createdUser.password
        }, process.env.JWT_SECRET_KEY, 
        {
            expiresIn: 30,
        })

        return res.status(201).json({success: true, user: createdUser, token})
    }catch(err){
        console.log("ERROR AT CREATE USER", err)
        return res.status(500).json({error: err})
    }
}


const loginUser = async (req, res) => {
    try{
        const foundUser = await User.findOne({ email: req.body.email })
        if(!foundUser) return res.sendStatus(401)

        //check if passwords match
        const validateUser = await bcrypt.compare(req.body.password, foundUser.password)
        if(!validateUser) return res.status(400).json({message: "Incorrect email or password"})
        const token = jwt.sign({
            email: foundUser.email,
            password: foundUser.password
        }, process.env.JWT_SECRET_KEY, 
        {
            expiresIn: 30,
        })


        return res.status(200).json({success: true, user: foundUser, token})
    }catch(err){
        console.log("ERROR AT LOGIN USER", err)
        return res.status(500).json({error: err})
    }
}

const deleteUser = async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "User successfully deleted"})
    }catch(err){
        console.log("ERROR AT DELETE USER",err)
        return res.status(500).json({error: err})
    }
}

module.exports = {
    createUser,
    deleteUser,
    loginUser
}