const express = require('express');
const {port} = require('./config.json');
const db = require('./module/postgres/pg.js');
const {
    getBooks,
    addContent,
} = require('./methods/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/books', getBooks(db));
app.post('/add-content', addContent(db));

// app.get('/book/:id', (request, response) => {
//     console.log('lo_ol__line_11 request:: ', request);
// });

app.listen(port, (err) => {
    if (err) {
        console.log('Sever error: ', err);
    }

    console.log('Service was started on port: ', port);
});
