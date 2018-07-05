const executeSQL = require('../models/sql');

module.exports = async ([], userID) => {
    console.log(userID, 'userID');
    const friendsList = await executeSQL('SELECT user_id FROM user_registered;', []);
    console.log(friendsList, 'friendsList');
    return [
        null,
        {
            friendsList,
            // message: '登录成功',
        },
    ];
};
