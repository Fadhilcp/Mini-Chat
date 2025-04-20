import express from 'express'
const app = express()
import session from 'express-session'

import path from 'path'

import { fileURLToPath } from 'url'

import nocache from 'nocache'

import db from './config/db.js'

import env from 'dotenv'
env.config()

import chatRoute from './routers/chatRoute.js'
import userRoute from './routers/userRoute.js'

// ====================================================
// Manually setting path module js
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ====================================================

db()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))

app.use(nocache())
app.use(express.json())

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:true,
        httpOnly:true,
        maxAge: 72*60*60*1000
    }
}))

app.use('/user',userRoute)
app.use('/',chatRoute)


app.listen(process.env.PORT,() => {
    console.log('server running in http://localhost:3000')
})