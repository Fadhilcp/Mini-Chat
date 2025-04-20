
import mongoose from "mongoose"
import User from './../model/userSchema.js'
import bcrypt from 'bcrypt'

const loginPage = (req,res) => {
    try {
        
        if(!req.session.user){
           return res.render('login')
        }else{
            res.redirect('/')
        }
    } catch (error) {
        console.error('login page render Error:',error)
    }
}

const login = async (req,res) => {
    try {
        const {email,password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.json({status:false,message:`User isn't existing`})
        }

        const passwordMatch = await bcrypt.compare(password,user.password)

        if(!passwordMatch){
            return res.json({status:false,password:true,message:'Password is not valid!'})
        }

        req.session.user = user._id

        res.json({status:true})

    } catch (error) {
        console.log('Login error:',error)
    }
}

const registerPage = (req,res) => {
    try {
        
        if(!req.session.user){
            res.render('register')
        }else{
            res.redirect('/')
        }
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

         const newUser = await User.insertOne({name,email,password:hashPassword})

         req.session.user = newUser.id

         return res.json({status:true,message:'Registration successful'})
        
    } catch (error) {
        console.error('user register error:',error)
        res.status(500).json({status:false,message:'Server error'})
    }
}

export default {
    loginPage,
    login,
    registerPage,
    register
}