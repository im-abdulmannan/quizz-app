import { useEffect } from "react"

const {io} = require("socket.io-client")

const Admin = () => {


    useEffect(() => {
        const socket = io("http://localhost:3000")
        socket.on("connect", () => {
            console.log(socket.id)
        })
    
    }, [])
    

  return (
    <div>Admin</div>
  )
}

export default Admin