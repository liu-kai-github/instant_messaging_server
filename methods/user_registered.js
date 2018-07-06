const executeSQL = require('../models/sql');

module.exports = async ([userID, password]) => {

    // console.log(userID, password, 'username, password');
    const isExist = await executeSQL('SELECT user_id from user_registered WHERE user_id = ?', [userID]);
    console.log(isExist, 'isExist');
    if (isExist.length !== 0) {
        return [
            {
                message: '该用户名已经存在',
            }
        ]
    }

    const result = await executeSQL('INSERT INTO user_registered (user_id, password, updated_time) VALUES (?, ?, ?);', [userID, password, Date.now()]);
    // console.log(result, 'result');
    return [
        null,
        {
            userID,
            message: '注册成功',
        },
    ];
};
