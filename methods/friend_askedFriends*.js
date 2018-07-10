const executeSQL = require('../models/sql');

module.exports = async ([], userID) => {
    const askedFriends = await executeSQL(
        `SELECT target_id as userID, 'asked' as askedType, updated_time 
        FROM relation_ask 
        WHERE user_id = ? 
        UNION 
        SELECT user_id, 'ask', updated_time 
        FROM relation_ask 
        WHERE target_id = ? 
        ORDER BY updated_time DESC;`,
        [userID, userID]
    );

    return [
        null,
        {
            askedFriends,
        }
    ];
};
