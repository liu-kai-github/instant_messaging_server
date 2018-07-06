const executeSQL = require('../models/sql');
const {canBeAddedFriends} = require('../server/friend.server');

module.exports = async ([], userID) => {
    console.log(userID, 'userID');
    const friendsList = await canBeAddedFriends(userID);
    console.log(friendsList, 'friendsList');
    return [
        null,
        {
            friendsList,
            // message: '登录成功',
        },
    ];
};
