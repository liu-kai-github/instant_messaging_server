const errorMap = new Map();

errorMap.set(-32700, 'Parse error 语法解析错误');         // 服务端接收到无效的json。该错误发送于服务器尝试解析json文本
errorMap.set(-32600, 'Invalid Request 无效请求');        // 发送的json不是一个有效的请求对象。
errorMap.set(-32601, 'Method not found 找不到方法');     // 该方法不存在或无效
errorMap.set(-32602, 'Invalid params 无效的参数');       // 无效的方法参数。
errorMap.set(-32603, 'Internal error 内部错误');         // JSON-RPC内部错误。
errorMap.set(-31999, 'No permission 没有权限');         // JSON-RPC内部错误。
errorMap.set(-31998, 'Invalid token 无效 TOKEN');         // JSON-RPC内部错误。
errorMap.set(-31997, 'Token has expired TOKEN 已过期');         // JSON-RPC内部错误。

module.exports = errorMap;
