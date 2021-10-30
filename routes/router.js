const express = require('express')
const router = express.Router()
const User = require('../config')

const SECURITYHASH = "NE3sF6KCT1YVDupz"

router.route("/createUser").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        const number = req.body.number
        User.add({name, number})
        .then(() => {
            res.send({ msg: "User Added" });
        })
    }
});

router.route("/addContact").post((req, res) => {
    
})

router.route('/')
module.exports = router