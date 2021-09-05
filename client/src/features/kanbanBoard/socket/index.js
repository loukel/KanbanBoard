import { socket } from "@/hooks/useSocket"

export const updateItems = (data, columns) => {
  socket.emit('board:items', [data, columns])
}

export const updateColumns = (data, columns) => {
  socket.emit('board:columns', [data, columns])
}

export const updateColumn = (columnId, data) => {
  socket.emit('board:column', [columnId, data])
}