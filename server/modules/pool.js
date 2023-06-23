// require pg
const pg = require('pg');
// set up pg to connect to database 
const pool = new pg.Pool({
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432
});

// exporting pool for use in server
module.exports = pool