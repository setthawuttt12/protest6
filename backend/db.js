const mysql = require('mysql2')
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'kaoei',
    dateStrings: true,
    timezone: "+07:00",
})

module.exports = pool.promise()