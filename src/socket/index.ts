import { Socket } from "socket.io";
import { User } from "../types";

let contacts:User[]=[]
let onlineUserList:User[]=[]

export const newConnectionHandler=(socket:Socket)=>{
    console.log(`New userJoined their id is ${socket.id}`)
    socket.emit("Welcome", socket.id)
    

    
 
    
    socket.on("add",payload=>{
        console.log(payload)
        contacts.push({name:payload.name,email:payload.email,avatar:payload.avatar})
    })
    socket.on("login",payload=>{
     console.log(payload)
     onlineUserList.push()
    })
    
  
    // socket.on("sendMessage", ({ recipients, message }) => {
    //     recipients.forEach((recipient: Socket) => { 
    //       let newRecipients = recipients.filter((r: Socket) => r !== recipient); 
    //       newRecipients.push(socket.id)
    //       socket.broadcast.to(recipient).emit("recieve-message",{
    //         recipients:newRecipients, sender:socket.id,Text
    //       })
    //     });
    //   });
    
    // socket.on("disconnect",()=>{
    //     onlineUsers=onlineUsers.filter(a=>a.socketId!==socket.id)
    //     socket.broadcast.emit("updateOnlineUsersList",onlineUsers)
    // })
}
