const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const orderLinkedList = require('./utils/linkedList')

let board = {
  loading: true,
  updating: false,
  columns: [],
  lastUpdated: new Date(),
}

module.exports = (io) => {
  const initBoard = async function (socket) {
    // const socket = this
    socket.join('board')
    if (board.loading) {
      let columns = await prisma.column.findMany({
        include: {
          items: true,
        },
      })

      // Order columns
      columns = orderLinkedList(columns)

      // Order items in each column
      columns = columns.map(column => {
        column.items = orderLinkedList(column.items)
        return column
      })
      board.columns = columns
      board.loading = false
    }
    socket.emit('board data', board)
  }

  const updateColumns = async function ([dataUpdate, columns]) {
    if (!board.updating) {
      board.updating = true
      board.lastUpdated = new Date()
      board.columns = columns
      io.to('board').emit('board data', board)

      let queries = []
      dataUpdate.forEach(update => {
        const id = update.id
  
        const data = {
          nextId: update.nextId,
        }
  
        const query = prisma.column.update({
          where: {
            id
          },
          data
        })
  
        queries.push(query)
      })
      await prisma.$transaction(queries)
      board.updating = false
      board.lastUpdated = new Date()
      io.to('board').emit('board data', board)
    }
  }

  const updateColumn = async function ([columnId, data]) {
    if (!board.updating) {
      board.updating = true
      board.lastUpdated = new Date()
      let columnIndex = board.columns.findIndex(column => column.id === columnId)
      board.columns[columnIndex] = {
        ...board.columns[columnIndex],
        ...data,
      }
      io.to('board').emit('board data', board)

      await prisma.column.update({
        where: {
          id: columnId,
        },
        data
      })
      board.updating = false
      board.lastUpdated = new Date()
      io.to('board').emit('board data', board)
    }
  }

  const updateItems = async function ([dataUpdate, columns]) {
    if (!board.updating) {
      board.updating = true
      board.lastUpdated = new Date()
      board.columns = columns
      io.to('board').emit('board data', board)

      let queries = []
      dataUpdate.forEach(update => {
        const id = update.id
    
        const data = {
          nextId: update.nextId,
        }
    
        if (update.columnId) {
          data['columnId'] = update.columnId
        }
    
        const query = prisma.item.update({
          where: {
            id
          },
          data
        })
    
        queries.push(query)
      })
    
      await prisma.$transaction(queries)
      board.updating = false
      board.lastUpdated = new Date()
      io.to('board').emit('board data', board)
    }
  }

  return {
    initBoard,
    updateColumns,
    updateColumn,
    updateItems,
  }
}