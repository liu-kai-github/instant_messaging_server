const executeSQL = require('../models/sql');
const {canBeAddedFriends} = require('../server/friend.server');

/**
 * 获取可添加的好友列表
 * @param userID
 * @return {Promise<*[]>}
 */
module.exports = async ([], userID) => {
    // console.log(userID, 'userID');
    const friendsList = await canBeAddedFriends(userID);
    // console.log(friendsList, 'friendsList');
    return [
        null,
        friendsList,
    ];
};
