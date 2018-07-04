const executeSQL = require('../models/sql');
const jwt = require('jsonwebtoken');

// session token 期限 单位：毫秒
const tokenTimeLimit = 1000 * 60 * 15;

module.exports = async ([username, password]) => {
    // console.log(username, password, 'username, password');
    const isExist = await executeSQL('SELECT * FROM user_registered WHERE user_id = ? AND password = ?;', [username, password]);

    if (isExist.length === 0) {
        return [
            {
                message: '用户名或密码错误',
            }
        ];
    }

    const userOnlineInfo = await executeSQL('SELECT * FROM user_online WHERE user_id = ?;', [username]);
    if (userOnlineInfo.length !== 0 && (Date.now() - userOnlineInfo[0].recent_access_time <= tokenTimeLimit)) {
        await executeSQL('UPDATE user_online SET recent_access_time = ? WHERE session_token = ?;', [Date.now(), userOnlineInfo[0].session_token]);
        return [
            null,
            {
                username,
                sessionToken: userOnlineInfo[0].session_token,
                message: '已登录过',
            },
        ];
    }

    const sessionToken = jwt.sign({username}, 'shhhhh');
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
