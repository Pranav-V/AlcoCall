const express = require('express')
const router = express.Router()
const User = require('../config')

router.route("/create").post((req, res) => {
    const data = req.body
    User.add({ data })
        .then(() => {
            res.send({ msg: "User Added" });
        })
});

router.route('/')
module.exports = router