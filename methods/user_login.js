const jwt = require('jsonwebtoken');
const executeSQL = require('../models/sql');
const {TOKEN_TIME_LIMIT: tokenTimeLimit} = require('../variables/user');
const {clearUserOnlineInfo} = require('../server/user.server');

// session token 期限 单位：毫秒
// const tokenTimeLimit = 1000 * 60 * 15;

module.exports = async ([userID, password]) => {
    // 验证当前用户名和密码是否正确
    const isExist = await executeSQL('SELECT * FROM user_registered WHERE user_id = ? AND password = ?;', [userID, password]);
    // 如果用户名或密码不正确
    if (isExist.length === 0) {
        return [
            {
                message: '用户名或密码错误',
            }
        ];
    }

    // 查看当前用户已经在线
    const userOnlineInfo = await executeSQL('SELECT * FROM user_online WHERE user_id = ?;', [userID]);
    // 如果用户未在线或者登录过期
    if (userOnlineInfo.length !== 0) {
        // 如果 token 还没有过期
        if ((Date.now() - userOnlineInfo[0].updated_time) <= tokenTimeLimit) {
            // 更新一下最新的登录时间
            await executeSQL('UPDATE user_online SET updated_time = ? WHERE user_id = ?;', [Date.now(), userID]);
            return [
                null,
                {
                    userID,
                    sessionToken: userOnlineInfo[0].session_token, // 继续使用原来 token
                    message: '已登录过',
                },
            ];
        }

        await clearUserOnlineInfo(userID);
    }

    // 已当前用户名为基础建立 token
    const sessionToken = jwt.sign({userID}, 'shhhhh');
    // 将用户登录信息存入数据库
    await executeSQL('INSERT INTO user_online (session_token, user_id, updated_time) VALUES (?, ?, ?);', [sessionToken, userID, Date.now()]);
    return [
        null,
        {
            userID,
            sessionToken,
            message: '登录成功',
        },
    ];
};
