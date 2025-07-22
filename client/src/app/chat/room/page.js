"use client";

import { useEffect } from "react";

import { DM_Serif_Text, Montserrat } from "next/font/google";

import '../../globals.css';
import './page.css'

import 'animate.css';

import config from "../../config.js";

const dmSerif = DM_Serif_Text({
  weight: "400",
  subsets: ['latin']
});

const socket = new WebSocket(`ws://${config.SERVER_HOST}:${config.SERVER_PORT}`);

let privkey = null;
let pubkey = null;

const SERVER_HOST = config.SERVER_HOST
const SERVER_PORT = config.SERVER_PORT

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"]
});

function Navbar() {
  return (
    <div id="navbar" className="w-screen flex px-4 py-4">
      <h1 className="text-3xl">
        <a href="/">
          cinder
        </a>
      </h1>
    </div>
  );
}

function strToArrayBuffer(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

function ChatInput() {
  return (
    <input
      id='chat-input'
      className="bg-neutral-700 rounded-md px-2 py-2 mt-6"
      placeholder="send message">
    </input>
  );
}

function SendChatButton() {
  const onClick = async () => {
    let message = document.querySelector('#chat-input').value;

    let roomID = window.sessionStorage.getItem('room');
    let sessionID = window.localStorage.getItem('session-id');

    let encoder = new TextEncoder();

    let encoded = encoder.encode(message);

    let ciphertext = await window.crypto.subtle.encrypt(
      {name: 'RSA-OAEP'},
      pubkey,
      (new TextEncoder()).encode(message).buffer
    );

    socket.send(JSON.stringify({
      type: 'message',
      payload: {
        session_id: sessionID,
        room: roomID,
        encrypted: Array.from(new Uint8Array(ciphertext))
      }
    }));
  };

  return (
    <button
      className="bg-neutral-700 px-8 py-2 rounded-md create"
      onClick={onClick}>
        send message
    </button>
  );
}

function ChatContent() {
  return (
    <div id="content" className={`rounded-lg grow-in w-2xl px-8 py-8 mx-auto bg-neutral-900 ${montserrat.className}`}>
      <h2 className="text-2xl">
        <a href="/">
          example chatroom
        </a>
      </h2>

      <ChatInput />

      <div className="items-right text-right mt-6">
        <SendChatButton />
      </div>
    </div>
  );
}

export default function ChatRoom() {
  useEffect(() => {
    const initializeKeys = async () => {
      const privateKeyData = window.sessionStorage.getItem('cinder-private');
      const publicKeyData = window.sessionStorage.getItem('cinder-public');

      if (!privateKeyData || !publicKeyData) {
        console.error('Keys not found in session storage');
        return;
      }

      try {
        privkey = await window.crypto.subtle.importKey(
          'jwk',
          JSON.parse(privateKeyData),
          {
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
          },
          true,
          ['decrypt']
        );

        pubkey = await window.crypto.subtle.importKey(
          'jwk',
          JSON.parse(publicKeyData),
          {
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
          },
          true,
          ['encrypt']
        );
      } catch (error) {
        console.error('Failed to import keys:', error);
        return;
      }
    };

    initializeKeys();

    let roomID = window.sessionStorage.getItem('room');
    let sessionID = window.localStorage.getItem('session-id');

    if (sessionID == null || roomID == null) {
      window.location.href = '/chat/create';
    }

      socket.onopen = () => {
        socket.send(JSON.stringify({
          type: 'join',
          payload: {
            session_id: sessionID,
            room: roomID,
          }
        }));

        socket.send(JSON.stringify({
          type: 'handshake',
          payload: {
            public_key: JSON.parse(window.sessionStorage.getItem('cinder-public')),
            session_id: sessionID,
            room: roomID,
          }
        }));
      };

      socket.onmessage = (e) => {
        console.log(e.data);

      }

  }, []);

  return (
    <div>
      <div className="max-h-screen">
        <Navbar />
        <ChatContent />
      </div>
    </div>
  );
}