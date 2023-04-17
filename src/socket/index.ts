import { Socket } from "socket.io";
import { User } from "../types";

let contacts:User[]=[]
let onlineUserList:User[]=[]

export const newConnectionHandler=(socket:Socket)=>{
    console.log(`New userJoined their id is ${socket.id}`)
    socket.emit("Welcome", socket.id)
    socket.on("createRoom", (roomName) => {
        
        socket.join(roomName);
       
        socket.to(roomName).emit("roomCreated", roomName);
      });
    
    // socket.on("add",payload=>{
    //     // console.log(payload)
    //     // contacts.push({name:payload.name,email:payload.email,avatar:payload.avatar})
        
    // })
    socket.on("login",payload=>{
     console.log(payload)
     onlineUserList.push()
    })
    
  
    // socket.on("outgoing-msg", ({ recipients, message }) => {
    //     recipients.forEach((recipient: Socket) => { 
    //       let newRecipients = recipients.filter((r: Socket) => r !== recipient); 
    //       newRecipients.push(socket.id)
    //       socket.broadcast.to(recipient).emit("incoming-msg",{
    //         recipients:newRecipients, sender:socket.id,Text
    //       })
    //     });
    //   });
    
    socket.on("disconnect",()=>{
        // onlineUsers=onlineUsers.filter(a=>a.socketId!==socket.id)
        // socket.broadcast.emit("updateOnlineUsersList",onlineUsers)
        console.log("bye")
    })
}
