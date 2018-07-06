const executeSQL = require('../models/sql');

/**
 * @description 根据 userID 注销用户的登录信息
 * @param userID
 * @return {Promise<*>}
 */
async function clearUserOnlineInfo(userID) {
    await executeSQL('DELETE FROM user_online WHERE user_id = ?', [userID]);
    return userID;
}

module.exports = {
    clearUserOnlineInfo,
};
