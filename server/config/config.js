const mysql = require('mysql');

const db = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'competency_framework',
    dateStrings: 'date',
});

module.exports = db;