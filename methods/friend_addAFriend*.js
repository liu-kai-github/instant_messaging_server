const executeSQL = require('../models/sql');
const {canBeAddedFriends} = require('../server/friend.server');

module.exports = async ([targetUserID], userID) => {
    const friendsList = await canBeAddedFriends(userID);
    console.log(friendsList, 'friendsList');
    if (!friendsList.find(i => i.user_id === targetUserID)) {
        return [
            {
                message: '添加用户不存在',
            }
        ];
    }

    const alreadyAsked = await executeSQL('SELECT * FROM relation_ask WHERE user_id = ? AND target_id = ?;', [userID, targetUserID]);
    console.log(alreadyAsked, 'alreadyAsked');
    if (alreadyAsked.length !== 0) {
        await executeSQL('UPDATE relation_ask SET updated_time = ? WHERE user_id = ? AND target_id = ?;', [Date.now(), userID, targetUserID]);
        return [
            {
                message: '曾经添加过该好友',
            }
        ];
    }

    await executeSQL('INSERT INTO relation_ask (user_id, target_id, updated_time) VALUES (?, ?, ?)', [userID, targetUserID, Date.now()]);
    return [
        null,
        {
            message: '已发送请求',
        }
    ]
};
