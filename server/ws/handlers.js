import { broadcast, getChatrooms } from "../state.js";

import { redisClient } from "../controllers/redis.js";

export function setupWSHandlers(wss) {
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
      console.log('Received:', message.toString());
      process(ws, message);
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });
}

function process(ws, msg) {
  let data = JSON.parse(msg);

  switch (data.type) {
    case "message":
      sendMessage(data);
      break;
    case "join":
      processJoin(ws, data);
      break;
    case "handshake":
      processHandshake(ws, data);
      break;
  }
}

function sendMessage(msg) {
  let room_id = msg.payload.room;

  broadcast(room_id, msg);
}

function processHandshake(ws, msg) {
  let room_id = msg.payload.room;

  broadcast(room_id, msg);
}

async function processJoin(ws, msg) {
  let room = getChatrooms().get(msg.payload.room);

  if (!room) {
    let _payload = {
      "success": false,
      "message": "room does not exist"
    }

    ws.send(JSON.stringify({
      type: "system",
      payload: _payload
    }));

    ws.close();

    return;
  }

  // Clean up any closed connections first
  room.users = room.users.filter(user => user.readyState === 1);

  // Check if user is already in the room
  for (let i = 0; i < room.users.length; i++) {
    if (room.users[i].session_id === msg.payload.session_id) {
      let _payload = {
        "success": false,
        "message": "already in room"
      }

      ws.send(JSON.stringify({
        type: "system",
        payload: _payload
      }));

      ws.close();

      console.log('Sent', _payload.toString());

      return;
    }
  }

  if (room.users.length >= 2) {
    let _payload = {
      "success": false,
      "message": "room is full"
    }

    ws.send(JSON.stringify({
      type: "system",
      payload: _payload
    }));

    ws.close();

    return;
  }

  // Set session ID and add to room only after all checks pass
  ws.session_id = msg.payload.session_id;
  room.users.push(ws);

  const ttl = await redisClient.ttl(msg.payload.room);

  let _payload = {
    "success": true,
    "ttl": ttl
  };

  ws.send(JSON.stringify({
    type: "system",
    payload: _payload
  }));
}