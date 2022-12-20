const net = require('net');

const server = net.createServer((socket) => {
    socket.on("data", (bugger) => {
        const requestString = buffer.toString('utf-8')

        const request = parseRequest(requestString)

        console.log(request.method, request.path, request.protocol);

        console.log(requestString);
    })
})

const parseRequest = (requestString) => {
    const [method, path, protocol] = requestString.split(" ");
}

server.listen(9999, () => console.log("Listening"))