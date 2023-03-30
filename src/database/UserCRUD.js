const User = require('./User');
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

class UserCRUD {
  #collectionName = "users"

  async getUserById(id = Number()) {
    const userRef = doc(db, this.#collectionName, `${id}`)
    const userResponse = await getDoc(userRef)
    const userInfo = userResponse.data()

    return userInfo ? new User({ ...userInfo }) : null
  }

  async updateUser(user = new User()) {
    await setDoc(doc(db, this.#collectionName, `${user.id}`), user.getInfo())
  }

  async createUserById(id = 0) {    
    const userRef = doc(db, this.#collectionName, `${id}`)

    const userResponse = await getDoc(userRef)
    const userInfo = userResponse.data()

    if (userInfo)
      return
    
    await setDoc(
      doc(db, this.#collectionName, `${id}`), 
      new User({ id }).getInfo()
    )
  }
}

const userCRUD = new UserCRUD()

module.exports.userCRUD = userCRUD