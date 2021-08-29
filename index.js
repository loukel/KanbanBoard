const express = require('express')
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

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(formData.parse())

// Routes 🐎
app.use(routes)

// Start Server 🎉
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`CORS-enabled web server listening on ${PORT}`)
})