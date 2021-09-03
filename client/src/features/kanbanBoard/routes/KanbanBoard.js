import { useEffect, useState } from "react"
import { Board } from "../components/Board"
import { Container } from "react-bootstrap"
import io from "socket.io-client"

let socket = null
export const KanbanBoard = () => {
  const [board, setBoard] = useState({
    loading: true,
    columns: [],
  })

  // Fetch-then-render columns
  useEffect(() => {
    // connect to the socket server
    socket = io('ws://localhost:3001')

    socket.on("connect", () => {
      socket.emit("board", 1)
    })
    socket.on('board data', data => {
      setBoard(data)
    })
  }, [])

  if (board.loading) {
    return <div>Loading...</div>
  }

  return (
    <Container className='text-center p-3'>
      <Board columns={board.columns} />
    </Container>
  )
}