import { socket } from "@/hooks/useSocket"

export const updateItems = (data, columns) => {
  socket.emit('update items', [data, columns])
}

export const updateColumns = (data, columns) => {
  socket.emit('update columns', [data, columns])
}

export const updateColumn = (columnId, data) => {
  socket.emit('update column', [columnId, data])
}