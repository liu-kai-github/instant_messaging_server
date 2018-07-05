const checkValidity = require('./checkValidity');
const allMethods = require('./allMethods');
const executeSQL = require('./models/sql');

/**
 * @description 根据请求体，按照 JSON-RPC 2.0 规则进行相应的响应
 * @param ctx
 * @return {Promise<*>}
 */
module.exports = async (ctx) => {
    // 如果是单个请求对象，直接处理并返回
    if (!Array.isArray(ctx.request.body)) {
        return singleHandle(ctx.request.body, ctx.get('x-access-token'));
    } else { // 如果是数组，则全部处理后，一并返回
        const promiseArr = ctx.request.body.map(
            item => {
                return singleHandle(item, ctx.get('x-access-token'));
            }
        );
        // 等待全部处理完成
        return Promise.all(promiseArr);
    }
};

/**
 * @description 处理单个请求
 * @param requestBody 单个请求体对象
 * @return {Promise<*>}
 */
async function singleHandle(requestBody, token) {
    const {method, params, id} = requestBody;

    // 检验请求是否有效
    const error = await checkValidity(requestBody, token);
    if (error) {
        return {
            jsonrpc: '2.0',
            id,
            error,
        };
    }

    const userIDResult = await executeSQL('SELECT user_id FROM user_online WHERE session_token = ?', [token]);
    let userID = '';
    if (userIDResult.length !== 0) {
        userID = userIDResult[0].user_id;
    }
    const [err, result] = await allMethods[method](params, userID);
    if (err) {
        return {
            error: err,
        }
    }
    return {
        jsonrpc: '2.0',
        id,
        result,
    };
}
