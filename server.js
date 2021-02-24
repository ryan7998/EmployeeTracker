const express = require('express');
const connection = require('./db/database');

const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();



/* connection.query(
    'SELECT * FROM `employee`',
    function(err, results, fields) {
        if(err){
            console.log(err);
        }
      console.table(results); // results contains rows returned by server
    //   console.log(fields); // fields contains extra meta data about results, if available
    }
  ); */

  connection.promise().query('SELECT * FROM `employee`')
  .then( ([rows,fields]) => {
    console.table(rows);
  })
  .catch(console.log)
  .then( () => connection.end());

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});