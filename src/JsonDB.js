const fs = require('fs');
const path = require('path');
const User = require('./User');
const SubDate = require('./SubDate');

class JsonDB {
  #dbPath = path.join(__dirname, '..', 'database', 'index.json')

  async getUserById(id = 0) {
    if (typeof id !== 'number')
      return;

    const allUsers = await this.#readDb()

    return allUsers.find(user => user.id === id) || null
  }

  async hasUserAcces(id) {
    const user = this.getUserById(id)

    if (!user) 
      return false
    
    if (!user.trialMessageCount)
      return false
    
    return new SubDate().isSubActual()
  }

  async createUserById(id = 0) {
    if (typeof id !== 'number')
      return;

    const allUsers = await this.#readDb()

    const hasUserAlready = allUsers.find(user => user.id === id)

    if (hasUserAlready)
      return;

    allUsers.push(new User({ id }))

    await this.#pushDb(allUsers)
  }

  #readDb() {
    return new Promise((res) => {
      fs.readFile(this.#dbPath, (_, data) => {
        const parsedData = JSON.parse(data)
        res(parsedData)
      })
    })
  }

  #pushDb(data) {
    return new Promise((res) => {
      const stringifyData = JSON.stringify(data)
      fs.writeFile(this.#dbPath, stringifyData, () => {
        res(null)
      })
    })
    
  }
}

const jsonDB = new JsonDB()

module.exports.jsonDB = jsonDB