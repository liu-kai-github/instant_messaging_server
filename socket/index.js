const Koa = require('koa');
const socket = require('socket.io');
const http = require('http');
const cors = require('koa-cors');

const executeSQL = require('../models/sql');

const app = new Koa();
app.use(cors());

const server = http.createServer(app.callback());
const io = new socket(server);

io.on('connection', (socket) => {
    // console.log(socket.id);
    const id = socket.id;
    let userID;

    socket.on('bind token', async (data) => {
        try {
            userID = (await executeSQL('SELECT user_id FROM user_online WHERE session_token = ?;', [data.sessionToken]))[0].user_id;
            await executeSQL('UPDATE user_online SET socket_id = ? WHERE session_token = ?;', [id, data.sessionToken]);
            io.to(id).emit('bind token', {
                socketID: id,
            });
        } catch (e) {
            console.warn('bind token error');
        }
    });

    socket.on('all users', async () => {
        const allUsers = await executeSQL('SELECT user_id FROM user_online;', []);
        socket.emit('all users', {
            allUsers,
        });
        socket.broadcast.emit('all users', {
            allUsers,
        });
    });

    socket.on('maybe friends', async () => {
        const allUsers = await executeSQL('SELECT user_id FROM user_online;', []);
        io.to(id).emit('all users', {
            allUsers,
        });
    });

    socket.on('friend list', async () => {
        const firendList = await executeSQL('SELECT * FROM relation_established WHERE user_id = (SELECT user_id FROM user_online WHERE socket_id = ?);', [id]);
        io.to(id).emit('friend list', {
            firendList
        });
    });

    socket.on('add friend', async (data) => {
        const user = await executeSQL('SELECT * FROM user_online WHERE user_id = ?;', [data.targetUserID]);
        if (user) {
            await executeSQL('INSERT INTO relation_ask (user_id, target_id, updated_time) VALUES (?, ?, ?)', [userID, data.targetUserID, Date.now()]);
            // console.log(userID, 'add friend');
            io.to(id).emit('friend list', {
                msg: '请求已发送',
            });

            io.to(id).emit('maybe friends', {
                friends: await getMaybeFriends(userID),
            });

            io.to(user.socket_id).emit('friend list', {
                friends: await getMaybeFriends(userID),
            });
        } else {
            console.log(user, 'add friend');
            io.to(id).emit('friend list', {
                msg: '用户未在线',
            });
        }
    });

    socket.on('chat content', async (data) => {
        const user = (await executeSQL('SELECT * FROM user_online WHERE user_id = ?;', [data.targetUserID]))[0];
        // console.log(user, 'user');
        // console.log('chat content');
        if (user) {
            console.log(user.socket_id);
            console.log(socket.id);
            // console.log(data.content);
            io.to(user.socket_id).emit('chat content', {
                targetUserID: userID,
                content: data.content,
            });
        }
    });
});

async function getMaybeFriends(userID) {
    const friends = await executeSQL(
        `SELECT target_id as userID, 'asked' as askedType, updated_time as askedTime
                FROM relation_ask 
                WHERE user_id = ? 
                UNION 
                SELECT user_id, 'ask', updated_time 
                FROM relation_ask 
                WHERE target_id = ? 
                ORDER BY askedTime DESC;`,
        [userID, userID]
    );
    return friends;
}

server.listen(8000);
