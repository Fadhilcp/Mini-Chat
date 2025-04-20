import express from 'express'
const app = express()

import path from 'path'

import { fileURLToPath } from 'url'

import env from 'dotenv'
env.config()

import chatRoutes from './userChat/chatRoute.js'

// ====================================================
// Manually setting path module js
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// ====================================================


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')))

app.use('/',chatRoutes)


app.listen(process.env.PORT,() => {
    console.log('server running in http://localhost:3000')
})