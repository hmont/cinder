let chatrooms = new Map();

chatrooms.set('dev', {
    users: [],
    timer: Date.now()
});

export function newChatroom(id) {
    const room = {
        users: [],
        timer: Date.now()
    };

    setTimeout(() => {
        chatrooms.delete(id);
        console.log(`Room ${roomId} auto-deleted.`);
    }, 10 * 60 * 1000);

    chatrooms.set(id, room);
}

export function broadcast(roomID, msg) {
    let room = chatrooms.get(roomID);

    if (room == null) {
        return;
    }

    room.users.forEach(user => {
        user.send(JSON.stringify(msg));
    });
}

export function getChatrooms() {
    return chatrooms;
}