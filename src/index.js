const express = require('express');
const {port} = require('./config.json');
const Ajv = require('ajv');
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
// const ss = function (request, response, next) {
//     const ajv = new Ajv();
//     const schema = require(`${process.cwd()}/methods${request.url}/schema.js`);
//     const validator = ajv.compile(schema);
//
//     if (!validator(request.body.data)) {
//         log.error('Error validate body! Msg: ', validator.errors[0].message);
//         response.status(400).send({error: 'NOT_VALID_BODY'});
//         return;
//     }
//
//     next();
// }
//
// app.use(ss);

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
