const mysql2 = require('mysql2')

const db = mysql2.createConnection(
    {
        port:'3307',
        database:'protest6',
        host:'localhost',
        user:'root',
        password:'1234'
    }
)

module.exports = db.promise()