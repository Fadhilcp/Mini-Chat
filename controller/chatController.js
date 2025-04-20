
const home = async (req,res) => {
    try {

        
        res.render('index')
    } catch (error) {
        res.redirect('/login')
    }
}

export default {
    home
}