import { useEffect, useState, useRef} from 'react'
import './App.css'
import { io } from 'socket.io-client';

//--------------------COMPONENTS-----------------------
import Header from "../components/Header";
import Command from '../components/Commands'
import InputHandler from '../components/InputHandler'
import Connexion from '../components/Connexion'

const socket = io('http://localhost:5242', { autoConnect: true }); // Adresse du serveur backend

function App() {
  const[username,setUsername] = useState("")
  const[msgHistory,setMsgHistory] = useState<string[]>([])

  const[users,setUsers] = useState<string[]>([])
  const[channels,setChannels] = useState<string[]>([])
  const[curentChannel,setCurentChannel] = useState()

  const[chatDiv,setChatDiv] = useState("hidden ")

  const[openedChannel,setOpenedChannel] = useState("")

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll automatiquement en bas quand un nouveau message arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgHistory]);

  //Gere le changement de user
  useEffect(()=>{
    if(username != ""){
      NewUser(username)
      setChatDiv('')
    }
  },[username])

  //----------------Écouter les messages via Socket.IO-------------------
  useEffect(() => {
    socket.on('chat message', (msg) => {
      console.log("message recu en front")
      setMsgHistory((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('chat list', (list) => {
      console.log("content list filtered : " , list.content)
      setMsgHistory((prevMessages) => [...prevMessages, list]);
    })

    socket.on('users', usersList =>{
      console.log('users received : ' , users)
      setUsers(usersList)
    })

    socket.on('msg',(allMsgInDb)=>{
      setMsgHistory(allMsgInDb.filter((msg)=> msg.channel == "General"))
    })

    socket.on('channels', (channelsList)=>{
      console.log('channels received : ' , channelsList)
      setChannels(channelsList)
      setOpenedChannel('General')
    })

    socket.on('change channel', (channelParam) => {
      setOpenedChannel(channelParam.openedChannel);
          const msgFiltered = channelParam.allMsg.filter(msg => msg.channel === channelParam.openedChannel);
          setMsgHistory(msgFiltered);
      console.log('Channel changed with socket.io');
  });
  
  

    return () => {
      socket.off("chat message");
      socket.off("chat list");
      socket.off("users");
      socket.off("channels");
      socket.off("change channel");
    };
  }, []);

  const chat = msgHistory.map((msg , index)=> {
    if(msg.isNotif){
      return (
        <div key={index} className='flex gap-4 bg-black border-2 border-black rounded-lg p-2 m-1'>
          <p className='text-white'>{msg.username ? `${msg.username} : ${msg.content}` : `Server : ${msg.content}`}</p>
          </div>
      )
    }
    else{
      return (
        <div key={index} className='flex gap-4 bg-white border-2 border-black rounded-lg p-2 m-1'>
          <p className='text-black'>{msg.username ? `${msg.username} : ${msg.content}` : `${msg.content}`}</p>
          </div>
      )
    }
    
  })
  const listUsers = users.map((user,index)=> {
    return (
      <div key={index}>
        <p>{user.username}</p>
      </div>
    )
  })

  const listChannels = channels.map((channelFromList)=> {
    return (
      <div className='flex flex-col content-center'>
          <a className='hover:text-black' onClick={(e) =>{
            console.log("channels = ",openedChannel)
            socket.emit("change channel", {previousChannel : openedChannel, newChannel : channelFromList.channel})
            setOpenedChannel(channelFromList.channel)
            console.log('channel changed successfully on ' , channelFromList.channel)
            e.preventDefault()
            }}>
            {channelFromList.channel}
          </a>
      </div>
    )
  })

  function NewUser(name : string){
    
    socket.emit('user connected', { name, id: socket.id });
  }

  //en appuyant sur le boutton
  function CreateChannel(e,channel : string){ 
    e.preventDefault()
    socket.emit('create channel',channel) 
  }
  
  return (
    <>
    <Command/>

    <Connexion chatDiv={chatDiv} users={users} setUsername={setUsername} setChatDiv={setUsername} setUsers={setUsers} />
      
      <div className={chatDiv + "flex flex-col gap-2"}>
          <Header socket={socket} username={username}/>
          <div className='flex'>
            <div className='w-4/6 h-96 flex flex-col justify-end border-2 border-black m-8 rounded-xl p-2 relative'>
            <div className='list overflow-auto'>
              <div className='absolute -top-8 bg-blue-500 rounded-full p-2'><p>{openedChannel}</p></div>
              {chat}
              <div ref={messagesEndRef} />
            </div>
            </div>
            <div className='flex flex-col gap-4 w-2/6'>
              <div className='list flex flex-col items-center h-44 rounded-lg p-2 m-1 overflow-auto bg-purple-500'>
                <h1>Users</h1>
                <p>-------</p>
                {listUsers}
              </div>
              <div className='list flex flex-col items-center h-52 rounded-lg p-2 m-1 relative overflow-auto bg-purple-500'>
                <h1>Channels</h1>
                <p>-------</p>
                {listChannels}
                <div className='flex justify-end'>
                  <form className='flex' onSubmit={(e) => CreateChannel(e,document.getElementById("newChannel").value)}>
                    <input type="text" id='newChannel'/>
                    <button className='px-2 py-1'><i className="fa-solid fa-plus"></i></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <InputHandler username={username} socket = {socket} msgHistory = {msgHistory} users={users} channels={channels} openedChannel={openedChannel}
          setMsgHistory= {setMsgHistory} setOpenedChannel={setOpenedChannel} setUsername={setUsername} />
          
      </div>
    </>
  )
}

export default App
