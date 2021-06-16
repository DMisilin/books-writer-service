const express = require('express');
const {port} = require('./config.json');
const {
    getBooks,
    addContent,
    modifyContent,
} = require('./methods/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post('/books', new getBooks().run());
app.post('/add-content', new addContent().run());
app.post('/modify-content', new modifyContent().run());

app.listen(port, (err) => {
    if (err) {
        console.log('Sever error: ', err);
    }

    console.log('Service was started on port: ', port);
});
