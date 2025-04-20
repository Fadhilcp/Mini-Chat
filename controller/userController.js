
import mongoose from "mongoose"
import User from './../model/userSchema.js'
import bcrypt from 'bcrypt'

const login = (req,res) => {
    try {
        
        res.render('login')
    } catch (error) {
        console.error('login page render Error:',error)
    }
}

const registerPage = (req,res) => {
    try {
        
        res.render('register')
    } catch (error) {
        console.error('register page render Error:',error)
    }
}

const register = async(req,res) => {
    try {

        const {name,email,password} = req.body

        const userExists = await User.findOne({email:email})

        if(userExists){
            return res.json({status:false,message:'User already exist'})
        }

        const hashPassword = await bcrypt.hash(password,10)

         await User.insertOne({name,email,password:hashPassword})

         return res.json({status:true,message:'Registration successful'})
        
    } catch (error) {
        console.error('user register error:',error)
        res.status(500).json({status:false,message:'Server error'})
    }
}

export default {
    login,
    registerPage,
    register
}