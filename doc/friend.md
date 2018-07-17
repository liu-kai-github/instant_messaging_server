# 接口文档

## 好友相关

### 1. 获取可添加的好友列表

#### request

- method: ```friend_canAddFriends*```
- params: [ ]

```
{
	"jsonrpc": "2.0",
	"method": "friend_canAddFriends*",
	"id": "1234",
	"params": []
}
```

#### response

> 成功

- result

| 参数名 | 说明 |
| --- | --- |
| object [ ] | result 为一个对象数组 |
| > object | 用户对象 |
| > > userID:string | 可添加为好友的用户 ID |

```
{
    "jsonrpc": "2.0",
    "id": "1234",
    "result": [
        {
            "user_id": "edfg"
        },
        {
            "user_id": "hijk"
        },
        {
            "user_id": "lmn"
        }
    ]
}
```

> 失败

- error

*可能返回的错误码*

1. []()

### 2. 添加一个好友

#### request

- method: ```friend_askAFriend*```
- params: [targetUserID]

| 参数名 | 必选 | 说明 |
| --- | :---: | --- |
| targetUserID:string | Y | 欲添加为好友的用户 ID |

```
{
	"jsonrpc": "2.0",
	"method": "friend_askAFriend*",
	"id": "1234",
	"params": ['defg']
}
```

#### response

> 成功

- result

| 参数名 | 说明 |
| --- | --- |
| object | result 为一个对象 |
| > targetUserID:string | 已提交添加好友申请的用户 ID |
| > message:string | 成功提示信息 |

```
{
    "jsonrpc": "2.0",
    "id": "1234",
    "result": {
        "targetUserID": "defg",
        "message": "已发送请求"
    }
}
```

> 失败

- error

*可能返回的错误码*

1. []()

### 3. 获取添加当前用户为好友的和当前用户添加过的好友名单组合列表

#### request

- method: ```friend_askedFriends*```
- params: [ ]

```
{
	"jsonrpc": "2.0",
	"method": "friend_askedFriends*",
	"id": "1234",
	"params": []
}
```

#### response

> 成功

- result

| 参数名 | 说明 |
| --- | --- |
| object [ ] | result 为一个对象数组 |
| > object | 好友对象 |
| > > userID:string | 好友用户 ID |
| > > askedType:string | 'ask' 表示主动添加当前用户，'asked' 表示被当前用户添加 |
| > > askedTime:number | 申请添加好友的时间戳 |

```
{
    "jsonrpc": "2.0",
    "id": "1234",
    "result": [
        {
            "userID": "defg",
            "askedType": "ask",
            "askedTime": 1531794893920
        },
        {
            "userID": "hijk",
            "askedType": "asked",
            "askedTime": 1531132700602
        }
    ]
}
```

> 失败

- error

*可能返回的错误码*

1. []()

### 4. 同意一个好友的申请

#### request

- method: ```friend_agreeAFriend*```
- params: [targetUserID]

| 参数名 | 必选 | 说明 |
| --- | :---: | --- |
| targetUserID:string | Y | 同意添加为好友的用户 ID |

```
{
	"jsonrpc": "2.0",
	"method": "friend_agreeAFriend*",
	"id": "1234",
	"params": ['defg']
}
```

#### response

> 成功

- result

| 参数名 | 说明 |
| --- | --- |
| object | result 为一个对象 |
| > targetUserID:string | 已互为添加为好友的用户 ID |
| > message:string | 成功提示信息 |

```
{
    "jsonrpc": "2.0",
    "id": "1234",
    "result": {
        "targetUserID": "defg",
        "message": "已发送请求"
    }
}
```

> 失败

- error

*可能返回的错误码*

1. []()