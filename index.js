const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const formData = require('express-form-data')
const socket = require("socket.io")
// const routes = require('./routes')

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
// app.use(routes)

// Start Server 🎉
const PORT = process.env.PORT || 3001
let server = app.listen(PORT, () => {
  console.log(`Web server listening on ${PORT}`)
})

const io = socket(server, {
  cors: {
    origin: '*',
  }
})

const { initBoard, updateColumns, updateItems, updateColumn } = require("./sockets")(io)
const onConnection = socket => {
  initBoard(socket)

  socket.on('board:init', initBoard)
  socket.on('board:columns', updateColumns)
  socket.on('board:column', updateColumn)
  socket.on('board:items', updateItems)
}

io.on('connection', onConnection)