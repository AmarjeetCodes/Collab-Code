import React, { useState } from 'react'
import editorImg from "../assets/editor.svg";

import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';


const Home = () => {

  const navigate = useNavigate();

  const [roomId , setRoomId]  = useState('');
  const [username, setUsername] = useState('');

  const createRoomId = (e) => {
    e.preventDefault();
    const id = uuidv4()
    setRoomId(id);
    toast.success("Room created");
  }
   const isFormFilled =  roomId.trim() !== "" && username.trim() !== "";

  const joinRoom = ()=>{
    if(!roomId || !username){
      toast.error("Put both fields");
      return;
    }
    navigate(`/editorpage/${roomId}`,{
      state:{
        username
      }
    })

  }

  return (
    <div className="h-screen bg-[oklch(26.9%_0_0)] flex items-center justify-center">
      
      
      <div className="w-full max-w-sm bg-white text-black p-6 rounded-xl ">
        
        <div className="flex items-center gap-3">
          <img
            src={editorImg}
            alt="editor"
            className="w-15 h-15 object-contain"
          />

          <h2 className="text-4xl font-semibold">
            Collab <span className="text-black-500">&</span> Code
          </h2>
          
        </div>

        <p className="text-center text-gray-500 mb-6">
          lets begin !
        </p>

       

        <input type="text" name="" id=""  placeholder='  Room Id'  className='w-full  text-grey py-2 rounded-lg mb-3 pl-1.5 border border-black'
          value = {roomId}
          onChange={(e)=> setRoomId(e.target.value)}
        />
        <input type="text" name="" id=""  placeholder='  Username'  className='w-full  text-grey py-2 rounded-lg mb-3 pl-1.5 border border-black'
          value = {username}
          onChange={(e)=> setUsername(e.target.value)}
        />
         
     
        <button
          className={`w-full py-2 rounded-lg mb-3 transition-colors duration-200
            ${isFormFilled
              ? "bg-black text-white cursor-pointer"
              : "bg-zinc-600 text-white opacity-60 cursor-not-allowed"
            }`}
          disabled={!isFormFilled}
          onClick={joinRoom}
        >
         Join Room
        </button>
        <button className="w-full border border-black py-2 rounded-lg hover:bg-zinc-600 hover:text-white  focus:outline-2 cursor-pointer
             transition-colors duration-200 " onClick={createRoomId}>
          Create Room
        </button>
      </div>

    </div>
  )
}

export default Home
