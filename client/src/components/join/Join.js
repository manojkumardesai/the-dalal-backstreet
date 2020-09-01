import React, { useState } from 'react';

import './Join.css';

const Join =  (props) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const {handleClick} = props;

  const initiateChatRoom = () => {
    handleClick(name,room);
  }

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Join a chat room</h1>
        <div>
          <input placeholder="Name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <input placeholder="Room" className="joinInput mt-20" type="text" onChange={(event) => setRoom(event.target.value)} />
        </div>
        <button className={'button mt-20'} onClick={initiateChatRoom}>
          Enter
        </button>
      </div>
    </div>
  );
}

export default Join;
