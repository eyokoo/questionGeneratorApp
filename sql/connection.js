const mysql = require('mysql')
const env = require("dotenv").config("../.env")

class Connection {
  constructor() {
    if (!this.pool) {
      console.log('creating connection...')
      this.pool = mysql.createPool({
        connectionLimit: 100,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PW,
        database: process.env.MYSQL_DB
      })
      return this.pool
    }
    return this.pool
  }
}


const instance = new Connection()

module.exports = instance; 