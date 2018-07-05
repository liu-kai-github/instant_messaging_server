const fs = require('fs');
const path = require('path');

// 获取所有服务端在 methods 目录下定义的所有方法
const allMethods = fs.readdirSync(`${__dirname}/methods`)
    .filter(
        (f) => {
            return path.extname(f) === '.js';
        }
    )
    .map(f => {
        const filename = f.replace('.js', '');
        const requiredFile = require(`${__dirname}/methods/${f}`);
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

module.exports = allMethods;
