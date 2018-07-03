const executeSQL = require('../models/sql');
const jwt = require('jsonwebtoken');

module.exports = async ([username, password]) => {

    console.log(username, password, 'username, password');
    const isExist = await executeSQL('SELECT * FROM user_registered WHERE user_id = ? AND password = ?;', [username, password]);

    if (isExist.length === 0) {
        return [
            {
                message: '用户名或密码错误',
            }
        ];
    }

    const sessionToken = jwt.sign({username}, 'shhhhh');
    // console.log(sessionToken.length, 'sessionToken');
    // await executeSQL('', [username, password]);
    await executeSQL('INSERT INTO user_online (session_token, user_id, recent_access_time) VALUES (?, ?, ?);', [sessionToken, username, Date.now()]);
    return [
        null,
        {
            username,
            sessionToken,
            message: '登录成功',
        },
    ];
};
