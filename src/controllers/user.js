const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

const createUser = async (req, res) => {
    try{
        const duplicated = await User.findOne({ email: req.body.email })
        if(duplicated) return res.status(409).json({message: "Email already taken"})
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const createdUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        const token = jwt.sign({
            email: createdUser.email,
            password: createdUser.password
        }, process.env.JWT_SECRET_KEY, 
        {
            expiresIn: process.env.NODE_ENV === "prod" ? process.env.EXPIRY_DURATION : '1h',
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
        if(!foundUser) return res.status(400).json({message: "Incorrect email or password"})

        //check if passwords match
        const validateUser = await bcrypt.compare(req.body.password, foundUser.password)
        if(!validateUser) return res.status(400).json({message: "Incorrect email or password"})
        const token = jwt.sign({
            email: foundUser.email,
            password: foundUser.password
        }, process.env.JWT_SECRET_KEY, 
        {
            expiresIn: process.env.NODE_ENV === "prod" ? process.env.EXPIRY_DURATION : '1h',
        })
        return res.status(200).json({success: true, user: foundUser, token})
    }catch(err){
        return res.status(500).json({error: err})
    }
}

const updateUser = async (req, res) => {
    //FOR NOW IMAGE LANG SA
    try{
        const { id } = req.params
        const updatedInfo = req.body
        updatedInfo.image = `http://localhost:3000/uploads/${req.file.filename}`
        const updatedUser = await User.findOneAndUpdate({ _id: id }, { $set: updatedInfo }, { new: true })
        return res.status(200).json({ success: true, user: updatedUser })
    }catch(err){
        console.log("ERROR IN UPDATING PROFILE", err)
        return res.status(500).json({error: err})
    }
}

const deleteUser = async (req, res) => {
    try{
        await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({message: "User successfully deleted"})
    }catch(err){
        return res.status(500).json({error: err})
    }
}

module.exports = {
    createUser,
    deleteUser,
    loginUser,
    updateUser
}