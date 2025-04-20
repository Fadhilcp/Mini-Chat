
const userAuth = async (req,res,next) => {
    try {
        let user = req.session.user

        if(user){
            return next()
        }else{
            return res.redirect('/login')
        }
            
    } catch (error) {
        console.log('userAuth middleware Error:',error)
        res.redirect('/login')
    }
}

export default {
    userAuth
}