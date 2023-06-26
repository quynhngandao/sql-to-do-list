// require pg
const pg = require('pg');
// set up pg to connect to database 
let pool; 

if (process.env.DATABASE_URL) {
    pool = new pg.Pool({
        connectionString: process.env.DATABASE_URL, 
        ssl: {
            rejectUnauthorized: false
        }
    })
}else {
    pool = new pg.Pool({
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432
});
};
// exporting pool for use in server
module.exports = pool