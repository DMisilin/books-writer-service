// const fs = require('fs');
//
// module.exports = {
//     getSchemas() {
//         const cwd = process.cwd();
//         const path = `${cwd}/methods`;
//         const result = [];
//
//         const methods = fs.readdirSync(path);
//
//         methods.reduce((acc, index) => {
//             const methodPath = `${path}/${index}`;
//             if (fs.statSync(methodPath).isDirectory()) {
//                 const schema = fs.readFileSync(`${methodPath}/schema.js`, '');
//                 const ss = require(`${methodPath}/schema.js`);
//                 acc.push(schema);
//             }
//
//             return acc;
//         }, result);
//
//         return result;
//     }
// }
