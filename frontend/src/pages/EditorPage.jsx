import React, { useState } from 'react'
import editorimg from '../assets/editor.svg'
import User from '../components/User';
import Editor from  '../components/Editor';
import CodeMirrorEditor from '../components/CodeMirrorEditor'
import { toast } from 'react-toastify';

import { useParams,useNavigate } from 'react-router-dom';


const EditorPage = () => {
    const [users,setUsers] = useState([]);
    const { roomId } = useParams();
    const navigate = useNavigate();

    
    const handleCopyRoomId = async ()=>{
      
      await navigator.clipboard.writeText(roomId);
      toast.success(`Room id copied`)
    }

    const handleLeave = () => {
      navigate("/")
    }
    

  return (
    <div className="flex h-screen">

      {/* //left bar */}
      <div className="bg-zinc-900 w-1/4 p-4 flex flex-col h-screen ">
      <div>
        <div className="flex items-center gap-3 text-white w-fit">
          <img
            src={editorimg}
            alt="editor"
            className="w-15 h-15 object-contain"
          />

          <h2 className="text-3xl font-semibold">
            Collab <span className="text-zinc-300">&</span> Code
          </h2> 
        </div>
        <br />

       <hr className="border-neutral-300/60 w-full" />
       <br />
       <span className="text-2xl text-zinc-300">Connected</span>
       <br />
       <br />

       <div className="usersinfo flex flex-wrap gap-4 ">
            {users.map((user)=>(
                <User key={user.socketId} username = {user.username}/>
            ))};
       </div>
       </div>

        <div className='py-2  flex flex-col gap-3 mt-auto'>
       <button onClick={handleCopyRoomId} className="w-full border bg-gray-300 text-black-900 text-black border-white py-2 rounded-lg hover:bg-zinc-600 hover:text-white  focus:outline-2 cursor-pointer
             transition-colors duration-200  "> 
          Copy Room ID
        </button>
       <button onClick={handleLeave} className="w-full border text-white border-white py-2 rounded-lg hover:bg-rose-700 hover:text-white  focus:outline-2 cursor-pointer
             transition-colors duration-200 ">
          Leave Room 
        </button>
        </div>

      </div>

    

      {/* right editor */}
      <div className="bg-zinc-800 w-3/4 p-5 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto text-white text-3xl font-semibold">
          <Editor setUsers = {setUsers} />
          {/* or <CodeMirrorEditor /> */}
          
        </div>
      </div>

    </div>
  )
}

export default EditorPage
