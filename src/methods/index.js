const getBooks = require('./get-books/index.js');
const addContent = require('./add-content/index.js')
const modifyContent = require('./modify-content/index.js');
const removeContent = require('./remove-content/index.js');

module.exports = {
    getBooks: new getBooks().run(),
    addContent: new addContent().run(),
    modifyContent: new modifyContent().run(),
    removeContent: new removeContent().run(),
}
