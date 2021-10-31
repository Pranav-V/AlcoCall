const express = require('express')
const router = express.Router()
const User = require('../config')
const admin = require('firebase-admin')
const SECURITYHASH = "NE3sF6KCT1YVDupz"
const createMessage = require('../messageFunctions')

router.route("/createUser").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid hash: " + hash})
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
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        User.where("name", "==", name).get()
        .then((docs) => {
            docs.forEach((doc) => {
                User.doc(doc.id).update({
                    contacts: admin.firestore.FieldValue.arrayUnion(req.body.contactNumber),
                    names: admin.firestore.FieldValue.arrayUnion(req.body.contactName)
                });
            });
            res.send({ msg: "Contacts Added" });
        })
    }
})

router.route("/addContacts").post((req, res) => {
    const hash = req.body.hash
    if (hash != SECURITYHASH) {
        res.json({success: "false", msg: "Invalid Access"})
    } else {
        const name = req.body.name
        User.where("name", "==", name).get()
        .then((docs) => {
            docs.forEach((doc) => {
                User.doc(doc.id).update({
                    contacts: admin.firestore.FieldValue.arrayUnion.apply(this, req.body.contactNumber),
                    names: admin.firestore.FieldValue.arrayUnion.apply(this, req.body.contactName)
                });
            });
            res.send({ msg: "Contacts Added" });
        })
    }
})


// router.route("/sendAlert").post((req, res) => {
//     const hash = req.body.hash
//     if (hash != SECURITYHASH) {
//         res.json({success: "false", msg: "Invalid Access"})
//     } else {

//     }
// });

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
router.route('/')
module.exports = router