const executeSQL = require('../models/sql');

module.exports = async ([username, password]) => {

    console.log(username, password, 'username, password');
    const isExist = await executeSQL('SELECT user_id from user_registered WHERE user_id = ?', [username]);
    console.log(isExist, 'isExist');
    if (isExist.length !== 0) {
        return [
            {
                message: '该用户名已经存在',
            }
        ]
    }

    const result = await executeSQL('INSERT INTO user_registered (user_id, password, registration_time) VALUES (?, ?, ?);', [username, password, Date.now()]);
    console.log(result, 'result');
    return [
        null,
        {
            username,
            message: '注册成功',
        },
    ];
};
