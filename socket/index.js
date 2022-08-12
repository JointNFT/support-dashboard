const chatHandlers = require("../utils/chatHandlers");
const db = require("../utils/db.js");
var sockets = { support: {}, customers: {} };
let innitSocket = (io) => {
    io.on("connection", (socket) => {
        // socket object may be used to send specific messages to the new connected client
    
        socket.emit("connection", (data) => {
            // experimental , we want to move to setting up the account during the connection ideally.
            if ("type" in data && data.type == "support") {
                if (!(data.accessToken in sockets.support)) {
                    sockets.support[data.accessToken] = {};
                }
                sockets.support[data.accessToken][data.userAddress] = socket.id;
            } else {
                if (!(data.accessToken in sockets.customers)) {
                    sockets.customers[data.accessToken] = {};
                }
                sockets.customers[data.accessToken][data.userAddress] = socket.id;
            }
        });
    
        socket.on("test", (arg) => {
            socket.emit("response", "online");
        });
    
        socket.on("create-account", (data) => {
            if (data == null || data.userAddress  || data.accessToken ) {
                return;
            }
            if (data.type != "support") {
                chatHandlers.createNewUser(data.userAddress, data.accessToken);
            }
            if ("type" in data && data.type == "support") {
                if (!(data.accessToken in sockets.support)) {
                    sockets.support[data.accessToken] = {};
                }
                sockets.support[data.accessToken][data.userAddress] = socket.id;
            } else {
                if (!(data.accessToken in sockets.customers)) {
                    sockets.customers[data.accessToken] = {};
                }
                sockets.customers[data.accessToken][data.userAddress] = socket.id;
            }
            for (supportStaff in sockets.support[data.accessToken]) {
                io.to(sockets.support[data.accessToken][supportStaff]).emit("new-account", data);
            }
            io.to(socket.id).emit("new-account", data);
            
        });
    
        socket.on("send-message", (data) => {
            if (data == null || data.accessToken == null || data.message == null || data.to == null) {
                io.emit("message", "errored out");
            }
            chatHandlers.handleCustomerMessage(data.address, data.message, data.accessToken, data.to, data.from);
            // chatHandlers.pushToDiscord(data, client);
            let customer = (data.to == "support") ? data.from: data.to;
            
            if (sockets.customers[data.accessToken]) io.to(sockets.customers[data.accessToken][customer]).emit("message", data);
            
            for (supportStaff in sockets.support[data.accessToken]) {
                io.to(sockets.support[data.accessToken][supportStaff]).emit("message", data);
            }
            
        });
    
        socket.on("disconnect", () => {
            io.emit("userDisconnected");
        });
    
        socket.on("connect", (d) => {
            console.log("connected", d);
        });
    });
}

module.exports = innitSocket;