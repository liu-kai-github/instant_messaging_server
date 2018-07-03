const errorMap = require('./errorMap');
const allMethods = require('./allMethods');

/**
 * @description 检查 JsonRPC 数据的有效性
 * @param jsonRPCObj 要检查的对象
 * @param token
 * @return {*}
 */
module.exports = (jsonRPCObj, token) => {
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
    // else if (jsonRPCObj.method.endsWith('*') && token !== '不存在') {
    //     code = -31998;
    // }

    if (code) {
        return {
            code,
            message: errorMap.get(code),
        };
    }
    return null;
};
