const executeSQL = require('../models/sql');

module.exports = async ([username, password]) => {
    const result = await executeSQL('INSERT INTO registered_users (user_id, password, registration_time) VALUES (?, ?, ?);', [username, password, Date.now()]);
    console.log(result, 'result');
    return [
        null,
        {
            username,
            message: '注册成功',
        },
    ];
};
