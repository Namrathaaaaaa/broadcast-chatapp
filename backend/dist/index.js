"use strict";
// import express from 'express'
// import { WebSocketServer, WebSocket } from 'ws'
Object.defineProperty(exports, "__esModule", { value: true });
// const wss = new WebSocketServer({port:8080})
// interface User{
//     socket : WebSocket;
//     room: string
// }
// let allSockets :User[] =[]
// wss.on("connection",(socket)=>{
//     socket.on("message",(message)=>{
//         // @ts-ignore
//         const parsedMessage = JSON.parse(message)
//         if(parsedMessage.type === "join"){
//             console.log("User joined room " + parsedMessage.payload.roomId);
//             allSockets.push({
//                 socket,
//                 room: parsedMessage.payload.roomId
//             })
//         }
//         if(parsedMessage.type === 'chat'){
//             console.log("User wants to chat");
//             // let currentUserRoom = allSockets.find((x)=> x.socket== socket)
//             let currentUserRoom = null;
//             for(let i=0;i<allSockets.length;i++){
//                 if(allSockets[i].socket== socket){
//                     currentUserRoom = allSockets[i].room
//                 }
//             }
//             for(let i =0;i<allSockets.length;i++){
//                 if(allSockets[i].room== currentUserRoom){
//                     allSockets[i].socket.send(parsedMessage.payload.message)
//                 }
//             }
//         }
//     })
//     // socket.on("disconnect",()=>{
//     //     allSockets = allSockets.filter(x=> x!==socket);
//     // })
// })
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    socket.on("message", (message) => {
        // @ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type == "join") {
            console.log("user joined room " + parsedMessage.payload.roomId);
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type == "chat") {
            console.log("user wants to chat");
            // const currentUserRoom = allSockets.find((x) => x.socket == socket).room
            let currentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    currentUserRoom = allSockets[i].room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room === currentUserRoom &&
                    allSockets[i].socket !== socket // prevent sending back to sender
                ) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
});
