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
    // 设置默认的返回 code 为 0,表示正常返回
    let code = 0;

    // 获取请求体的所有属性
    const ownPropertyNames = Object.getOwnPropertyNames(jsonRPCObj);


    if ( // 检验请求体所有的属性是否正确
        ownPropertyNames.length !== 4
        || !ownPropertyNames.includes('jsonrpc')
        || !ownPropertyNames.includes('id')
        || !ownPropertyNames.includes('method')
        || !ownPropertyNames.includes('params')
    ) {
        code = -32600;
    } else if (!allMethods.hasOwnProperty(jsonRPCObj.method)) { // 检验请求的 method 包含于服务端定义的所有方法中
        code = -32601;
    } else if (!Array.isArray(jsonRPCObj.params)) { // 检验请求的参数是否是数组
        code = -32602;
    } else if (jsonRPCObj.method.endsWith('*') && !token) { // 当方法以 * 号结尾是，判断时候请求头是否带 token
        code = -31999;
    }

    // 当上面的判断都通过时，而且需要 token 验证时，继续一下判断
    if (code === 0 && jsonRPCObj.method.endsWith('*')) {
        // 查询当前 token 的在线信息
        const userOnlineInfo = await executeSQL('SELECT * FROM user_online WHERE session_token = ?;', [token]);

        if (userOnlineInfo.length === 0) { // 当前 token 无效
            code = -31998;
        } else if (Date.now() - userOnlineInfo[0].recent_access_time > tokenTimeLimit) { // token 超时
            code = -31997;
        }
    }

    // 如果 code 不为 0 ，返回相应的错误码和提示信息
    if (code) {
        return {
            code,
            message: errorMap.get(code),
        };
    }

    // 如果所有验证都通过，返回 null
    return null;
};
