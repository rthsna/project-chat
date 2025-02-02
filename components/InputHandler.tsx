import { Socket } from "socket.io-client";
import React from 'react'
//import script avec les requete a la bdd

type InputHandlerProps = {
  socket: Socket;
  msgHistory: string[]; channels: string[]; users: string[]; username : string; openedChannel : string;
  setOpenedChannel: React.Dispatch<React.SetStateAction<string>>;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setMsgHistory: React.Dispatch<React.SetStateAction<string[]>>;
};

const InputHandler: React.FC<InputHandlerProps> = ({socket, msgHistory, channels , users, username, openedChannel , setOpenedChannel, setUsername, setMsgHistory }) => {

  function AddChannel(channelToAdd : string){
    //front
    socket.emit('create channel', channelToAdd)
    //back
  }
  function DeleteChannel(channelToPop : string){
    //front
    socket.emit('delete channel', channelToPop)
    
    //back
  }

  function OnMessageSend(e : React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    const newValue = e.target[0].value.trim()
    
    const words = newValue.split(' ')
    const command = words[0]
    const text = words[1]
    
    // check si newValue contains une commande si oui commandes effectuer si non default comportement

    if (newValue.includes("/")){
      switch (command) {
        case '/nick':
          setUsername(text)                                ///<<<<----------[A FAIRE]---------------
          socket.emit('change username', text)
          //changer avec socket 
          break;
  
          case '/list':
            //list tous les channels si string apres faire une recherche avec le mot cle 
            if(text){
              socket.emit('list channels details', words[2])
            }
            else{
              socket.emit("list channels")
            }
          break;

          case '/create':                      //create a channel
              AddChannel(text)
          break;

          case '/delete':                     //delete a chanel
            DeleteChannel(text)
          break;

          case '/join':                         //rejoindre un autre channel + quit l'actuel (socket)
          console.log('joined enclencher and channel is : ' , channels , ' and inputuser is : ' , text)
            if(channels.find(e => e.channel == text.trim())){
              console.log("channels = ",openedChannel)
              socket.emit('change channel', {previousChannel : openedChannel , newChannel : text.trim()})
              setOpenedChannel(text)
              console.log('channel changed successfully on ' , text)
            }
          break;

          case '/quit':                          //quit le channel actuel (sockete)
           
          break;

          case '/users':                        //list des users sur le channel
            socket.emit("list users")
            //console.log(users)
          break;

          case '/msg':
            // envoie un msg a la personne preciser (stocker dans la bdd ??)
            //message d'erreur si non reconnu
            // voir avec socket.io
            console.log("socket : " ,socket )
            socket.emit('private message', {name : words[1], msg : (words).slice(2).join(' ') , id : socket.id})
          break;

          default :
            alert("Wrong Command")
            break
    } 
  }
  else if(newValue != ""){
    console.log("message envoyer")
    socket.emit('chat message', {content: newValue , username : username , channel : openedChannel , isNotif : false} ); // Envoie au serveur
  }
    
  const inputElement = document.getElementById('myInput') as HTMLInputElement;
  if (inputElement) inputElement.value = '';  
  }

//--------------------------------------------------------------FRONT-------------------------------------------------------------------------

  return (
    <div className='w-full flex justify-center'>
            <div className="card">
              <form onSubmit={(e) => OnMessageSend(e)}>
                <input type="text" id='myInput' className='w-full text-white p-2' placeholder="Taper votre message" /> 
              </form>
            </div>
          </div>
  )
}

export default InputHandler
