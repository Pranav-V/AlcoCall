const admin = require("firebase-admin")

admin.initializeApp({
  credential: admin.credential.cert(require('./keys/admin.json'))
});
const db = admin.firestore();
const User = db.collection("Users");
const Alarm = db.collection("Alarm")
module.exports = {User, Alarm};