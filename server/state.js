let chatrooms = new Map();

chatrooms.set('dev', {
    users: [],
    timer: Date.now()
});

export function getChatroom(id) {
    return chatrooms.get(id);
}

export function newChatroom(id) {
    const room = {
        users: [],
        timer: Date.now()
    };

    setTimeout(() => {
        chatrooms.delete(id);
        console.log(`Room ${id} auto-deleted.`);
    }, (10 * 60 * 1000) + 5000);

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

export function replace(roomId, sessionId, ws) {
    let room = getChatroom(roomId);

    if (!room) {
        return false;
    }

    let success = false;

    for (let i = 0; i < room.users.length; i++) {
        if (room.users[i].session_id === sessionId) {
            ws.session_id = sessionId
            room.users[i] = ws;
            success = true;
            break;
        }
    }

    return success;
}

export function getChatrooms() {
    return chatrooms;
}