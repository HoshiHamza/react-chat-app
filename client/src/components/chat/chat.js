import React, {useEffect,useState} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './chat.css'
import InfoBar from '../InfoBar/InfoBar';
import Input from '../input/Input';
import Messages from '../messages/Messages'
let socket;

const Chat = ({location}) => {
    const [name,setName]=useState('');
    const [room,setRoom]=useState('');
    const [message,setMessage]=useState('')
    const [messages,setMessages]=useState([])
    const ENDPOINT="https://git.heroku.com/reactjs-chat-appp.git"
    useEffect(()=>{
        const {name,room}=queryString.parse(location.search);
        socket=io(ENDPOINT);
        setName(name);
        setRoom(room);
        socket.emit('join',{name:name,room:room},()=>{
            
        })
        return()=>{
            socket.emit('disconnect');
            socket.off();
        }
    },[ENDPOINT,location])

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message])
        })
    },[messages])

    const sendMessage=(event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage',message,()=>{
                setMessage('')
            })
        }
    }
    console.log(message,messages)
    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} sendMessage={sendMessage} setMessage={setMessage}/>
                {/* <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} onKeyPress={(event)=>event.key==='Enter' ? sendMessage(event):null}/> */}
            </div>
        </div>
    );
};

export default Chat;