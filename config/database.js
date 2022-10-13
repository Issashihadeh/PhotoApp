const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'csc317db',
    password: 'Issa1233'
});

module.exports = db.promise();