const moment = require('moment');
const errorMap = require('./errorMap');
const allMethods = require('./allMethods');
const executeSQL = require('./models/sql');

// session token 期限 单位：毫秒
const tokenTimeLimit = 1000 * 60 * 15;

/**
 * @description 检查 JsonRPC 数据的有效性
 * @param jsonRPCObj 要检查的对象
 * @param token
 * @return {*}
 */
module.exports = async (jsonRPCObj, token) => {
    let code = 0;

    const ownPropertyNames = Object.getOwnPropertyNames(jsonRPCObj);
    if (
        ownPropertyNames.length !== 4
        || !ownPropertyNames.includes('jsonrpc')
        || !ownPropertyNames.includes('id')
        || !ownPropertyNames.includes('method')
        || !ownPropertyNames.includes('params')
    ) {
        code = -32600;
    } else if (!allMethods.hasOwnProperty(jsonRPCObj.method)) {
        code = -32601;
    } else if (!Array.isArray(jsonRPCObj.params)) {
        code = -32602;
    } else if (jsonRPCObj.method.endsWith('*') && !token) {
        code = -31999;
    }

    if (code === 0 && jsonRPCObj.method.endsWith('*')) {
        const userOnlineInfo = await executeSQL('SELECT * FROM user_online WHERE session_token = ?;', [token]);
        if (userOnlineInfo.length === 0) {
            code = -31998;
        } else if (Date.now() - userOnlineInfo[0].recent_access_time > tokenTimeLimit) {
            code = -31997;
        }
    }


    if (code) {
        return {
            code,
            message: errorMap.get(code),
        };
    }
    return null;
};
