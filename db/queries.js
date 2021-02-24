const connection = require('./database');

const showAll = (callback, table) =>{
    connection.promise().query(`SELECT * FROM ${table}`)
    .then( ([rows,fields]) => {
        console.log(`
        ==============================
                    ${table}
        ==============================
        `);
        // console.table(rows);
        callback(null, rows);
    })
    .catch(console.log)
    .then((data) => {
        //connection.end();
    })
}


module.exports = {
    showAll: showAll,
}