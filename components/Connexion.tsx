import React, { useState } from 'react'
type ConnexionProps = {
  chatDiv : string;
  users : string[];
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setUsers : React.Dispatch<React.SetStateAction<string[]>>;
    setChatDiv : React.Dispatch<React.SetStateAction<string>>;
  };

  const Connexion: React.FC<ConnexionProps> = ({users ,chatDiv,setUsername, setUsers ,setChatDiv }) => {

    const[connexionDiv,setConnexionDiv] = useState("")

    function OnConnection(event){
      event.preventDefault()
        const inputUser = event.target[0].value
        let nameInDb

        console.log(users)
        for (let index = 0; index < users.length; index++) {
          if(users[index].username == inputUser) nameInDb = users[index].username
        }
    
        console.log("user input : ", inputUser , " / users in database : ", nameInDb)
        //Requete avec le back 

        switch(inputUser.trim()){
            case '':
                alert('Please enter a username');
                break

            case nameInDb:
                alert("This name is already taken")
                break

            default:
                setConnexionDiv("hidden ")
                console.log(chatDiv)
                setUsername(inputUser.trim())
                //AddUser(inputUser)
                break
        }
      
        
      }
  return (

    <div className={`h-full w-full flex justify-center items-center ` + connexionDiv}>
      <div className='flex flex-col items-center card gap-2'>
          <h1>Connexion</h1>
          <form onSubmit={(e)=> OnConnection(e)}>
            <input type="text" className='px-4 py-2 bg-slate-200 text-white' />
          </form>
        </div>
    </div>
  )
}

export default Connexion
