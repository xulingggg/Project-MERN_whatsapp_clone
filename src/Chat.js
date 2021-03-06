import { Avatar,IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react';
import './Chat.css';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { AttachFile, SearchOutlined } from '@material-ui/icons';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import MicIcon from '@material-ui/icons/Mic';
import axios from './axios';
import { useParams } from 'react-router-dom';
import db from './firebase';

function Chat( {messages}) {

  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
      if (roomId) {
          db.collection('rooms').doc(roomId).onSnapshot(snapshot => (
            setRoomName(snapshot.data().name)
            ))
      }
  }, [roomId])

  const sendMessage = async (e) => {
    e.preventDefault();

    await axios.post('/messages/new', {
        message: input,
        name: "Ling Xu",
        timestamp: new Date().toUTCString(),
        received: true
    });
    
    setInput(' ');
  };

    return (
        <div className='chat'>
            <div className='chat_header'>
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className='chat_headerInfo'>
                    <h3>{roomName}</h3>
                    <p>Last seen {new Date().toUTCString()}</p>
               </div>
               <div className='chat_headerRight'>
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
               </div>

            </div>

            <div className='chat_body'>
                {messages.map((message) => (
                      <p className={` chat_message ${message.received && 'chat_receiver'} `}>
                      <span className='chat_name'>{message.name}</span>           
                        {message.message}
                      <span className='chat_timestamp'>
                      {new Date().toUTCString()}
                      </span>
                  </p>
                ))}
            </div>

            <div className='chat_footer'>
                <EmojiEmotionsIcon />
                <form>
                    <input value={input} onChange = { e=> setInput(e.target.value)} placeholder='Type a message' type='text' />
                    <button onClick={sendMessage} type='submit'>
                        Send a message
                    </button>
                </form>
                <MicIcon />

            </div>
            
        </div>
    )
}

export default Chat
