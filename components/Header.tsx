import { Socket } from "socket.io-client";

type InputHandlerProps = {
  socket : Socket;
  username : string
};

const Header: React.FC<InputHandlerProps> = ({socket , username}) => {
  
  function Disconect(){
    socket.disconnect()
    //console.log("input pressed")
  }

  return (
    <nav className='bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 flex justify-between items-center shadow-lg rounded-b-2xl backdrop-blur-md'>
      <div>
        <img src="img/chatos.png" alt="" className="w-20"/>
      </div>
        <div className='flex flex-col justify-center items-center gap-2'>
          <p className="bg-blue-200 rounded-full p-2">{username}</p>
          <a href="" className='bg-red-500 text-white rounded-lg p-2' onClick={() => Disconect()}>Disconect</a>
        </div>
    </nav>
  )
}

export default Header
