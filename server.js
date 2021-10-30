const express = require("express")
const cors = require("cors")
const http = require("http")

require("dotenv").config()

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
     body: 'Gautham Rajesh!!',
     from: '+15125964574',
     to: '+15124705282'
   })
  .then(message => console.log(message.sid));

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

