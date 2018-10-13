const Koa = require('koa');

const app = new Koa();
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log(socket.id);
    const id = socket.id;
    socket.on('chat message', function (msg) {
        io.to(id).emit('chat message', msg + id);
    });
});

http.listen(8000, () => {
    console.log('socket listening on *:' + 8000);
});
