const Redis = require('./redis');
const messageDB = require('../model/message');
const unreadDB = require('../model/unread');

// Note User Online
const liveUser = async (socketId, user) => {
    user['socketId'] = socketId;
    Redis.set(socketId, user._id);
    Redis.set(user._id, user);
}

// Enter
const initilaize = async (io, socket) => {
    socket['currentLoginUserId'] = socket.userData._id;
    await liveUser(socket.id, socket.userData);
    socket.on('message', data => incommingMessage(io, socket, data));
    socket.on('unreads', data => loadUnreadMsg(socket));
    socket.on('getUnreadMsg', data => getUnreadMessages(socket, data));
}

// Message Income
const incommingMessage = async (io, socket, data) => {

    // Save income message MessageDB
    const msg = await new messageDB(data).save();
    let saveMessage = await messageDB.findById(msg._id).populate('from to', 'name _id');

    // Check receive user Online or not
    const receiveUserOnline = await Redis.get(saveMessage.to._id);
    if (receiveUserOnline) {
        //OnLine
        // Get receiveUser Socket
        let receiveUserSocket = io.of('/chat').to(receiveUserOnline.socketId); // If login save socketId in line 7 => LiveUser
        if (receiveUserSocket) {
            receiveUserSocket.emit('message', saveMessage)
        } else {
            next(new Error('Receive user online but socket not found!'));
        }

    } else {
        // OffLine
        // Save Unread DB
        await new unreadDB({
            from: saveMessage.from._id,
            to: saveMessage.to._id
        }).save();
    }

    // Resend saveMessage to sendUser
    socket.emit('message', saveMessage);
}

// Get Unread Message Count
const loadUnreadMsg = async (socket) => {
    let unreads = await unreadDB.find({
        to: socket.currentLoginUserId
    });
    if (unreads.length > 0) {
        // Delete unreadDB data
        unreads.forEach(async (unread) => await unreadDB.findByIdAndDelete(unread._id));
    }
    // get unread message count
    socket.emit('unreads', {
        msg: unreads.length
    });
}

// Get Unread Messages
const getUnreadMessages = async (socket, data) => {
    let limit = Number(process.env.MSG_LIMIT);
    let start = Number(data.page) == 1 || Number(data.page) == 0 ? 0 : (Number(data.page) - 1);
    let skipCount = start * limit;
    let messages = await messageDB.find({
        $or: [{
                from: socket.currentLoginUserId
            },
            {
                to: socket.currentLoginUserId
            }
        ]
    }).sort({
        created: -1
    }).skip(skipCount).limit(limit).populate('from to', 'name _id');
    socket.emit('read-unreadMessages', messages);
}

module.exports = {
    initilaize
};