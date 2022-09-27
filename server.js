const express = require('express');
const app = express();
const server = app.listen(8000, () => {
    console.log("Server is running on port: 8000");
});
// app.use(cors());
const socket = require('socket.io');
const io = socket(server);

let tasks = [{
    id: 1,
    name: "cleaning"
}, {
    id: 2,
    name: " shopping"
}];

app.use((req, res) => {
    res.status(404).send({
        message: "Not Found..."
    })
});

io.on('connection', (socket) => {
    console.log('New client', socket.id);
    socket.emit('updateData', tasks);

    socket.on('addTask', (task) => {
        tasks.push(task);
        socket.broadcast.emit('addTask', task);
    });

    socket.on('removeTask', (taskId) => {
        console.log(taskId);
        tasks = tasks.filter(task => task.id !== taskId)
        socket.broadcast.emit('removeTask', taskId);
    })
});