const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Javac#14',
    database: 'test'
});

app.get('/test', (req, res) => {
    db.query('SELECT * FROM table_for_test', (err, result) => {
        if (err) {
            console.error(err);
            res.send("возникла ошибка выборки");
            return
        } else {
            res.send(result);
        }
    });
});


app.listen(3210, () => {
    console.log('Server active in port 3210')
});