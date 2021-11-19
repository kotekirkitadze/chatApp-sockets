// let express = require('express');
// let app = express();

// let http = require('http');
// let server = http.Server(app);

// let socketIO = require('socket.io');
// let io = socketIO(server);

// const port = process.env.PORT || 3000;

// server.listen(port, () => {
//   console.log(`Started on port: ${port}`);
// });

// io.on('connection', (socket) => {
//   socket.on('join', data => {
//     socket.join(data.room);
//     socket.broadcast.to(data.room).emit("user joined")
//   });

//   socket.on('message', (data) => {
//     io.in(data.room).emit('new message', { user: data.user, message: data.message })
//   })
// })


const http = require('http').createServer();
const io = require('socket.io')(http, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  socket.on('join', data => {
    socket.join(data.room);
    socket.broadcast.to(data.room).emit("user joined")
  });

  socket.on('message', (data) => {
    io.in(data.room).emit('new message', { user: data.user, message: data.message })
  })
})

http.listen(3000, () => console.log('listening on http://localhost:3000'))
