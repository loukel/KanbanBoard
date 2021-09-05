import { useState } from "react"
import { Board } from "../components/Board"
import { Container } from "react-bootstrap"
import { useSocket } from "@/hooks/useSocket"

export const KanbanBoard = () => {
  const [board, setBoard] = useState({
    loading: true,
    columns: [],
    updating: false,
    lastUpdated: null,
  })

  // Fetch-then-render columns
  useSocket(socket => {
    socket.on('board data', data => {
      if (board.lastUpdated === null || data.lastUpdated > board.lastUpdated) {
        setBoard(data)
      }
    })
  })
  
  if (board.loading) {
    return <div>Loading...</div>
  }

  return (
    <Container className='text-center p-3'>
      <Board 
        columns={board.columns} 
        updating={board.updating} 
      />
    </Container>
  )
}