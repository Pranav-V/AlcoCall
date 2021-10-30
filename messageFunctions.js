const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
require("dotenv").config()
const client = require('twilio')(accountSid, authToken)

function createMessage(phoneNumber, nameTo, nameFrom, mapLink) {
    client.messages
        .create({
            body: `\n\nHey ${nameTo}, ${nameFrom} is possibly drunk. Track their live location here: ${mapLink}`,
            from: '+15125964574',
            to: `+1${phoneNumber}`
        })
        .then(message => console.log(message.sid))
}

module.exports = createMessage
