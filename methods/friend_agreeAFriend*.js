const executeSQL = require('../models/sql');
const {canBeAddedFriends} = require('../server/friend.server');

module.exports = async ([targetUserID], userID) => {

    // 查看当前统一的用户，是否发过请求添加该用户
    const requested = await executeSQL(
        `SELECT *
        FROM relation_ask
        WHERE user_id = ? AND target_id = ?;`,
        [targetUserID, userID]
    );

    if (requested.length === 0) {
        return [
            {
                message: '目标用户未添加过此用户',
            }
        ]
    }

    const time = Date.now();
    await Promise.all([
        executeSQL(
            `INSERT INTO relation_established (user_id, friend_id, updated_time)
        VALUES (?, ?, ?);`,
            [targetUserID, userID, time]
        ),
        executeSQL(
            `INSERT INTO relation_established (user_id, friend_id, updated_time)
        VALUES (?, ?, ?);`,
            [userID, targetUserID, time]
        ),
        executeSQL(
            `DELETE FROM relation_ask
            WHERE user_id = ? AND target_id = ?
            OR target_id = ? AND user_id = ?;`,
            [userID, targetUserID, userID, targetUserID]
        ),
    ]);

    return [
        null,
        {
            message: '互相添加好友成功',
        }
    ]
};
