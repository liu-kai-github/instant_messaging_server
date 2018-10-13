# 接口文档

## 用户相关

### 1. 用户注册

#### request

- method: ```user_registered```
- params: [userID, password]

| 参数名 | 必选 | 说明 |
| --- | :---: | --- |
| userID:string | Y | 注册的用户名 |
| password:string | Y | 注册的密码 |

```
{
	"jsonrpc": "2.0",
	"method": "user_registered",
	"id": "1234",
	"params": ["abc","123456"]
}
```

#### response

> 成功

- result

| 参数名 | 说明 |
| --- | --- |
| object | result 为一个对象 |
| > userID:string | 注册成功的用户 ID |
| > message:string | 成功提示信息 |

```
{
    "jsonrpc": "2.0",
    "id": "1234",
    "result": {
        "userID": "abc",
        "message": "注册成功"
    }
}
```

> 失败

- error

*可能返回的错误码*

1. []()

### 2. 用户登录

#### request

- method: ```user_login```
- params: [userID, password]

| 参数名 | 必选 | 说明 |
| --- | :---: | --- |
| userID:string | Y | 用户名 |
| password:string | Y | 密码 |

```
{
	"jsonrpc": "2.0",
	"method": "user_login",
	"id": "1234",
	"params": ["abc","123456"]
}
```

#### response

> 成功

- result

| 参数名 | 说明 |
| --- | --- |
| object | result 为一个对象 |
| > userID:string | 注册成功的用户 ID |
| > message:string | 成功提示信息 |

```
{
    "jsonrpc": "2.0",
    "id": "1234",
    "result": {
        "userID": "1234",
        "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJMaXVLYWkiLCJpYXQiOjE1MzEyMTgxMjh9.EFc5Q_YUkrU75k9rP5Ye3D4wTXrECZePYAMpi4mnNho",
        "message": "登录成功"
    }
}
```

> 失败

- error

*可能返回的错误信息*

1. []()
