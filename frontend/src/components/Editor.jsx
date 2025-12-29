import React, { useEffect, useRef } from 'react'
import CodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import { initSocket } from '../socket';
import { useNavigate,useLocation , useParams ,Navigate} from 'react-router-dom';
import { toast } from 'react-toastify';


const Editor = ({setUsers}) => {

    const socketRef = useRef(null);
    const location = useLocation();
    const { roomId } =  useParams();
    const navigate = useNavigate();
    const codeRef = useRef('');
    const isRemoteUpdate = useRef(false);



//fixed 2
useEffect(() => {
  const handleError = (err) => {
    console.log("socket error:", err);
    toast.error("Socket connection failed");
    navigate("/");
  };

  // 🔹 create socket ONCE
  socketRef.current = initSocket();

  // 🔹 connection errors
  socketRef.current.on("connect_error", handleError);
  socketRef.current.on("connect_failed", handleError);

  // 🔹 CONNECT → only EMIT here
  socketRef.current.on("connect", () => {
    console.log("socket connected:", socketRef.current.id);

    socketRef.current.emit("join", {
      roomId,
      username: location.state?.username,
    });
  });

  // 🔹 LISTENERS (REGISTER ONCE)
  socketRef.current.on("joined", ({ clients, username ,socketId}) => {
    if (username !== location.state?.username) {
      toast.success(`${username} joined`);
    }
    setUsers(clients);
    // so i am editing here like i know here some client has joined 
      if (socketId !== socketRef.current.id) {
        socketRef.current.emit("sync-code", {
          code: codeRef.current,
          socketId
        });
      }
  });

  socketRef.current.on("disconnected", ({ clients, username }) => {
    toast.info(`${username} left`);
    setUsers(clients);
  });

  // code sync logic 
  socketRef.current.on("code-changed", ({ code }) => {
    isRemoteUpdate.current = true;
    setCode(code);
    codeRef.current = code;
  });


  // 🔹 CLEANUP
  return () => {
    if (socketRef.current) {
      console.log("disconnecting socket:", socketRef.current.id);

      socketRef.current.off("connect_error");
      socketRef.current.off("connect_failed");
      socketRef.current.off("joined");
      socketRef.current.off("disconnected");
      socketRef.current.off("code-changed");

      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };
}, []);

    

    const [code, setCode] = React.useState(
    `/*write your code here !!!*/`
  );

  // if no username  then navigate back
  if(!location.state){
    return <Navigate to ="/" />
  }

  const handleCodeChange = (newCode) => {
    
    codeRef.current = newCode;
    setCode(newCode);
    console.log("latest code " , codeRef.current)

    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    
    if(socketRef.current){
      socketRef.current.emit("code-change",{
        roomId,
        code:newCode
      });
    }
    


  }

  return (
    <div style={{height: '100%',overflow: 'auto'}} className="h-full w-full">
      {/* style={{ padding: "20px" }} */}
     <CodeEditor
        value={code}
        onValueChange={handleCodeChange}
        highlight={(code) => highlight(code, languages.js)}
        padding={12}
        style={{
          fontFamily: '"Fira Code", monospace',
          fontSize: 14,
          border: "1px solid #ddd",
          borderRadius: "6px",
          minHeight: "200px",
        }}
      />
    </div>
  )
}

export default Editor
