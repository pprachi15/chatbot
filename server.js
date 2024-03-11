const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

// Serve static files from the 'static' directory
// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));


// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'template', 'messaging.html'));
});


// Socket.io setup
const io = socketio(server);
const users = {};

io.on("connection", (socket) => {
    socket.on("new-user-joined", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
        io.emit("users-list", users);
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit('user-disconnected', user = users[socket.id]);
        delete users[socket.id];
        io.emit("users-list", users);
    });

    socket.on('message', (data) => {
        socket.broadcast.emit("message", { user: data.user, msg: data.msg });
    });
});

// Start the server
server.listen(port, () => {
    console.log("Server started at " + port);
});
