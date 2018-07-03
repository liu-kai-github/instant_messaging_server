const fs = require('fs');
const path = require('path');

const allMethods = fs.readdirSync(__dirname + '/' + 'methods')
    .filter(
        (f) => {
            return path.extname(f) === '.js';
        }
    )
    .map(f => {
        const filename = f.replace('.js', '');
        const requiredFile = require(__dirname + '/' + 'methods/' + f);
        // console.log(requiredFile.isAuth, 'requiredFile');
        return {
            [filename]: requiredFile,
        };
    })
    .reduce(
        (f1, f2) => {
            return {
                ...f1,
                ...f2,
            }
        }
    );

console.log(allMethods, 'allJSFiles');

module.exports = allMethods;
