import { useEffect, useState } from "react"
import { Board } from "../components/Board"
import { Container } from "react-bootstrap"
import io from "socket.io-client"

let socket = null
export const KanbanBoard = () => {
  const [board, setBoard] = useState({
    loading: true,
    columns: [],
    updating: false,
    lastUpdated: new Date().toISOString(),
  })

  // Fetch-then-render columns
  useEffect(() => {
    // connect to the socket server
    socket = io('ws://localhost:3001')

    socket.on("connect", () => {
      socket.emit("board", 1)
    })
    socket.on('board data', data => {
      if (data.lastUpdated > board.lastUpdated) {
        setBoard(data)
      }
    })
  }, [])

  const updateItems = (data, columns) => {
    socket.emit('update items', [data, columns])
  }

  const updateColumns = (data, columns) => {
    socket.emit('update columns', [data, columns])
  }

  const updateColumn = (columnId, data) => {
    socket.emit('update column', [columnId, data])
  }

  if (board.loading) {
    return <div>Loading...</div>
  }

  return (
    <Container className='text-center p-3'>
      <Board 
        columns={board.columns} 
        updating={board.updating} 
        updateItems={updateItems} 
        updateColumns={updateColumns}
        updateColumn={updateColumn}
      />
    </Container>
  )
}