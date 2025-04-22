import User from './../model/userSchema.js'
import Message from './../model/messageSchema.js'

const home = async (req,res) => {
    try {

        const user = req.session.user
        
        res.render('index',{
            user
        })
    } catch (error) { 
        res.redirect('/login')
    }
}

const search = async (req,res) => {
    let name = req.query.name

    try {
        
        const users = await User.find({name : {$regex:name,$options:'i'}}).select('-password')

        res.json(users)
    } catch (error) {
        console.error('user search error:',error)
        res.status(500).json({message:'search error'})
    }
}

const recent = async (req,res) => {
    try {

        let userId = req.session.user

        if(!userId) {
            return res.json({status:false})
        }

        let user = await User.findById({_id:userId}).populate('chatsWith','-password')

        if(!user) return res.status(500).json({message:'User not found'})

        res.json(user.chatsWith)
        
    } catch (error) {
        console.error('recent chats error:',error)
        res.status(500).json({message:'Server error'})
    }
}


const message = async (req,res) => {
    try {

        const userId = req.session.user
        const otherUserId = req.params.userId

        const messages = await Message.find({
            $or:[
                {sender:userId,receiver:otherUserId},
                {sender:otherUserId,receiver:userId}
            ]
        }).sort({timestamp:1})

        res.json(messages)
        
    } catch (error) {
        console.log('message fetching error:',error)
        res.status(500).json({message:'Server error'})
    }
}

const sendMessage = async (req,res) => {
    try {

        const io = req.app.get('io')

        const fromUserId = req.session.user
        const toUserId = req.body.to
        const content = req.body.text
    
        if (!fromUserId || !toUserId || !content) {
          return res.status(400).json({ status: false, message: 'Missing required fields' })
        }

        const message = new Message({
            sender:fromUserId,
            receiver:toUserId,
            content
        })

        await message.save()

        await User.findByIdAndUpdate(fromUserId, { $addToSet: { chatsWith: toUserId } })
        await User.findByIdAndUpdate(toUserId, { $addToSet: { chatsWith: fromUserId } })

        res.json({ status: true, message: 'Message sent' })
        
    } catch (error) {
        console.error('Send message error:', error)
        res.status(500).json({ status: false, message: 'Failed to send message' })
    }
}

export default { 
    home,
    search,
    recent,
    message,
    sendMessage
}