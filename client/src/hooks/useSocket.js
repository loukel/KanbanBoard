import { useEffect } from "react"
import io from "socket.io-client"
import { socketUrl } from "@/constants"

let socket = null
const useSocket = (callback) => {
  useEffect(() => {
    // connect to the socket server
    socket = io(socketUrl)

    socket.on("connect", () => {
      callback(socket)
    })
  }, [])
}

export {
  useSocket,
  socket
}