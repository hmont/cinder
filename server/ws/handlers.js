import { broadcast, getChatrooms, replace } from "../state.js";

import { redisClient } from "../controllers/redis.js";

export function setupWSHandlers(wss) {
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection');

    ws.on('message', (message) => {
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
    case "ttl":
      processTTL(ws, data);
      break;
  }
}

async function processTTL(ws, data) {
  let _ttl = await redisClient.ttl(data.payload.room);

  ws.send(JSON.stringify({
    type: "system/ttl",
    payload: {
      success: true,
      ttl: _ttl
    }
  }));
}

function sendMessage(msg) {
  let room_id = msg.payload.room;
  console.log('Received message');

  broadcast(room_id, msg);
}

function processHandshake(ws, msg) {
  let room_id = msg.payload.room;

  broadcast(room_id, msg);
}

async function processJoin(ws, msg) {
  let room = getChatrooms().get(msg.payload.room);

  const ttl = await redisClient.ttl(msg.payload.room);

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

  if (room.users.length >= 2) {
    let _payload = {
      success: false,
      message: "room is full"
    }

    if (replace(msg.payload.room, msg.payload.session_id, ws) === false) {
      ws.send(JSON.stringify({
        "type": "system",
        "payload": _payload
      }));

      ws.close();
      return;
    }

    _payload.success = true;
    _payload.ttl = ttl;

    ws.send(JSON.stringify({
      type: "system",
      payload: _payload
    }));

    return;
  }

  // Clean up any closed connections first
  room.users = room.users.filter(user => user.readyState === 1);

  // Check if user is already in the room
  for (let i = 0; i < room.users.length; i++) {
    if (room.users[i].session_id === msg.payload.session_id) {
      let _payload = {
        "success": true,
        "message": "already in room",
        "ttl": ttl
      }

      ws.send(JSON.stringify({
        type: "system",
        payload: _payload
      }));

      // ws.close();

      console.log('Sent', JSON.stringify(_payload));

      return;
    }
  }

  // Set session ID and add to room only after all checks pass
  ws.session_id = msg.payload.session_id;
  room.users.push(ws);

  let _payload = {
    "success": true,
    "ttl": ttl
  };

  ws.send(JSON.stringify({
    type: "system",
    payload: _payload
  }));
}