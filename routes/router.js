const express = require('express')
const router = express.Router()
const {User, Alarm} = require('../config')
const admin = require('firebase-admin')
const SECURITYHASH = "NE3sF6KCT1YVDupz"
const createMessage = require('../messageFunctions')

const interval = setInterval(() => {
    Alarm.get()
    .then((docs) => {
        docs.forEach((doc) => {
            if (doc.data().startTime + doc.data().amountTime <= Date.now()) {
                // do function
                Alarm.doc(doc.id).delete()
            }
        });
    })
}, 1000)

router.route("/createUser").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        const number = req.body.number
        User.add({name, number})
            .then(() => {
                res.send({success: true, msg: "User Added" });
            })
            .catch(err => res.json(err))
    }
});

router.route("/addContact").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: false, msg: "Invalid Access"})
    } else {
        const name = req.body.name
        User.where("name", "==", name).get()
        .then((docs) => {
            docs.forEach((doc) => {
                User.doc(doc.id).update({
                    contacts: admin.firestore.FieldValue.arrayUnion(...req.body.contactNumber),
                    names: admin.firestore.FieldValue.arrayUnion(...req.body.contactName)
                });
            });
            res.send({success: true, msg: "Contacts Added" });
        })
    }
})

router.route("/createAlarm").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        const amountTime = req.body.time
        const startTime = Date.now();
        Alarm.add({name, amountTime, startTime})
            .then(() => {
                res.send({success: true, msg: "Alarm Added" });
            })
            .catch(err => res.json(err))
    }
})

router.route("/getLocation").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        User.where("name", "==", name).get()
        .then((docs) => {
            docs.forEach((doc) => {
                res.send({
                    lat: doc.data().lat,
                    long: doc.data().long
                });
            });
        })
    }
})

router.route("/updateLocation").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        const lat = req.body.lat
        const long = req.body.long
        User.where("name", "==", name).get()
        .then((docs) => {
            docs.forEach((doc) => {
                User.doc(doc.id).update({
                    lat: lat,
                    long: long
                });
            });
            res.send({ msg: "Location Updated" });
        })
    }
})

router.route("/sendMessage").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        User.where("name", "==", name).get()
        .then((docs) => {
            docs.forEach((doc) => {
                doc.data().contacts.forEach((contact, i) => {
                    console.log(contact)
                    createMessage(contact, doc.data().names[i], name, "https://alcowatch-map.herokuapp.com/?name=" + name.replace(/ /g,"%20"))
                })
            });
            res.send({success: "true", msg: "Message Sent" });
        })
    }
})

router.route('/')
module.exports = router