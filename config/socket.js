

export default function socket(io){

    io.on('connection',(socket) => {

        socket.on('chat message',(msg) => {
            
            const messageData = {
                sender:socket.id,
                content : msg,
                timestamp : Date.now()
            }
            io.emit('chat message',messageData)
        })

        socket.on('disconnect', () => {
            console.log('User disconnected')
        })
    })
}  