import { broadcast, getChatrooms } from "../state.js";

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

  function process(ws, msg) {
    let data = JSON.parse(msg);

    switch (data.type) {
      case "message":
        sendMessage(data);
      case "join":
        processJoin(ws, data);
      case "handshake":
        processHandshake(ws, data);
    }
  }
}


function sendMessage(msg) {
  let room_id = msg.payload.room;

  broadcast(room_id, msg);
}

function processJoin(ws, msg) {
  console.log('Processing join');
  console.log('Room id:', msg.payload.room);
  console.log('session id:', msg.payload.session_id);

  ws.session_id = msg.payload.session_id;

  let room = getChatrooms().get(msg.payload.room);

  if (room === null) {
    return;
  }

  if (room.users.length >= 2) {
    return;
  }

  for (let i = 0; i < room.users.length; i++) {
    if (room.users[i].session_id === msg.payload.session_id) {
      return;
    }
  }

  room.users.push(ws);

  console.log('Processed join');
  console.log('Current rooms:', getChatrooms());
}