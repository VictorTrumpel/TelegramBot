const { initializeApp } = require('firebase/app');
const { firebaseConfig } = require('./firebaseConfig');
const { 
  getFirestore, 
  setDoc, 
  doc, 
  getDoc 
} = require('firebase/firestore/lite')

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

module.exports.db = db