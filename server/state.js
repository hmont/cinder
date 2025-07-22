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
        console.log(`Room ${id} auto-deleted.`);
    }, 10 * 60 * 1000);

    chatrooms.set(id, room);
}

export function broadcast(roomID, msg) {
    let room = chatrooms.get(roomID);

    if (room == null) {
        return;
    }

    room.users = room.users.filter(user => user.readyState === 1);

    room.users.forEach(user => {
        try {
            user.send(JSON.stringify(msg));
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
}

export function getChatrooms() {
    return chatrooms;
}