const express = require('express');
const {port} = require('./config.json');
const {
    getBooks,
    addContent,
    modifyContent,
    removeContent,
} = require('./methods/index.js');
const middleware = require('./module/middleware.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(middleware.validateSchema());

app.post('/books', getBooks);
app.post('/add-content', addContent);
app.post('/modify-content', modifyContent);
app.post('/remove-content', removeContent);

app.listen(port, (err) => {
    if (err) {
        console.log('Sever error: ', err);
    }

    console.log('Service was started on port: ', port);
});
