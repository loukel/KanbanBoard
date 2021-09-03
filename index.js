const express = require('express')
const socket = require("socket.io")
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const formData = require('express-form-data')
const routes = require('./routes')

// Set up environment variables 📝
const dotenv = require('dotenv')
dotenv.config()

// Create express app 🔨 
const app = express()

// Middleware 🔒 Currently Open to All Routes
app.use(cors({
  // origin: process.env.ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, POST, PUT, PATCH, DELETE",
}))
app.use(cors())

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(formData.parse())

// Routes 🐎
app.use(routes)

// Start Server 🎉
const PORT = process.env.PORT || 3001
let server = app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on ${PORT}`)
})

const io = socket(server, {
  cors: {
    origin: '*',
  }
})

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const orderLinkedList = require('./utils/linkedList')

io.on('connection', socket => {
  let board = {
    loading: true,
    updating: false,
    columns: [],
    lastUpdated: new Date(),
  }
  socket.on('board', async id => {
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
  })

  socket.on('update columns', async ([dataUpdate, columns]) => {
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
  })

  socket.on('update items', async ([dataUpdate, columns]) => {
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
  })

  socket.on('update column', async ([columnId, data]) => {
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
  })
})