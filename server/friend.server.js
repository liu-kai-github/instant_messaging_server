const executeSQL = require('../models/sql');

/**
 * @description 根据 userID 获取该用户的 可添加的好友列表
 * @param userID
 * @return {Promise<*>}
 */
async function canBeAddedFriends(userID) {
    return executeSQL('SELECT user_id FROM user_registered WHERE user_id != ?;', [userID]);
}

module.exports = {
    canBeAddedFriends,
};
