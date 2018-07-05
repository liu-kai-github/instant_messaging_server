const executeSQL = require('../models/sql');
const jwt = require('jsonwebtoken');

// session token 期限 单位：毫秒
const tokenTimeLimit = 1000 * 60 * 15;

module.exports = async ([username, password]) => {
    // 验证当前用户名和密码是否正确
    const isExist = await executeSQL('SELECT * FROM user_registered WHERE user_id = ? AND password = ?;', [username, password]);
    // 如果用户名或密码不正确
    if (isExist.length === 0) {
        return [
            {
                message: '用户名或密码错误',
            }
        ];
    }

    // 查看当前用户已经在线
    const userOnlineInfo = await executeSQL('SELECT * FROM user_online WHERE user_id = ?;', [username]);
    // 如果用户未在线或者登录过期
    if (userOnlineInfo.length !== 0 && (Date.now() - userOnlineInfo[0].recent_access_time) <= tokenTimeLimit) {
        // 更新一下最新的登录时间
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

    // 已当前用户名为基础建立 token
    const sessionToken = jwt.sign({username}, 'shhhhh');
    // 将用户登录信息存入数据库
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
