const executeSQL = require('../models/sql');

module.exports = async ([targetUserID], userID) => {
    const targetUser = executeSQL('SELECT * FROM user_registered WHERE user_id = ?', [targetUserID]);
    if (targetUser.length !== 1) {
        return [
            {
                message: '添加用户不存在',
            }
        ]
    }

    const alreadyAsked = executeSQL(' SELECT * FROM relation_ask WHERE user_id = ? AND target_id = ?;', [userID, targetUserID]);
    if (alreadyAsked.length !== 0) {

    }

    executeSQL()
};
