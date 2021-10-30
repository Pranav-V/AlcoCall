const express = require("express")
const cors = require("cors")
const http = require("http")
const createMessage = require("./messageFunctions")

const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())

const router = require('./routes/router')

app.use(router)

server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

