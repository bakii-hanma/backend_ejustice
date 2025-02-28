const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'mysql-emore-junior.alwaysdata.net',
    user: '373656',
    password: 'emore291961',
    database: 'emore-junior_ejustice',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise(); 