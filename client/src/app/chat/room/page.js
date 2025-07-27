"use client";

import { useContext, useEffect, useState } from "react";

import { DM_Serif_Text, Montserrat } from "next/font/google";

import Link from 'next/link';

import '../../globals.css';
import './page.css'

import 'animate.css';
import { formatTime } from "@/app/utils";

let privkey = null;
let pubkey = null;
let socket = null;

let BASE_URL;

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"]
});

const dmSerif = DM_Serif_Text({
  weight: "400",
  subsets: ['latin']
});

function Navbar() {
  return (
    <div id="navbar" className="w-screen flex px-4 py-4">
      <h1 className={`text-3xl ${dmSerif.className}`}>
        <Link href='/'>
          cinder
        </Link>
      </h1>
    </div>
  );
}

function ChatInput() {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      document.querySelector('.send-button').click();
    }
  };

  return (
    <input
      id='chat-input'
      className="bg-neutral-700 rounded-md px-2 py-2 mt-6"
      placeholder="send message"
      onKeyPress={handleKeyPress}>
    </input>
  );
}

function SendChatButton() {
  const onClick = async () => {
    let message = document.querySelector('#chat-input').value;

    if (!message.trim()) {
      return;
    }

    let roomID = window.sessionStorage.getItem('room');
    let sessionID = window.localStorage.getItem('session-id');

    const partnerKeyData = window.sessionStorage.getItem('partner-public');

    if (!partnerKeyData) {
      alert('Please wait for your partner to join!');
      return;
    }

    let partner_pubkey = await window.crypto.subtle.importKey(
      'jwk',
      JSON.parse(partnerKeyData),
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256"
      },
      true,
      ['encrypt']
    );

    let ciphertext = await window.crypto.subtle.encrypt(
      {name: 'RSA-OAEP'},
      partner_pubkey,
      (new TextEncoder()).encode(message).buffer
    );

    const messageElement = document.createElement('div');
    messageElement.className = 'message mb-2 p-2 bg-neutral-600 rounded text-right';
    messageElement.textContent = `${window.sessionStorage.getItem('nickname')}: ${message}`;

    const chatInput = document.querySelector('#chat-input');
    if (chatInput) {
      chatInput.parentNode.insertBefore(messageElement, chatInput);
      chatInput.value = '';
    }

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'message',
        payload: {
          session_id: sessionID,
          room: roomID,
          encrypted: Array.from(new Uint8Array(ciphertext))
        }
      }));
    } else {
      console.error('WebSocket is not open');
    }
  }

  return (
    <button
      className="bg-neutral-700 px-8 py-2 rounded-md create send-button"
      onClick={onClick}>
        send message
    </button>
  );
}

function ChatContent() {
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRoomId(window.sessionStorage.getItem('room') || '');
    }
  }, []);

  return (
    <div id="content" className={`rounded-lg grow-in w-2xl px-8 py-8 mx-auto mb-4 bg-neutral-900 ${montserrat.className}`}>
      <h2 className="text-2xl mb-4">
        chat room
      </h2>

      <ChatInput />

      <div className="items-right text-right mt-6">
        <SendChatButton />
      </div>

      <p className="mt-6">give this link to the person you&apos;d like to chat with (opens in new tab):</p>
        <p>
          <a target='_blank'
            href={`/chat/join?id=${roomId}`}
            className="underline">
            {`/chat/join?id=${roomId}`}
          </a>

        </p>
    </div>
  );
}

export default function ChatRoom() {
  let [ttl, setTTL] = useState(null);

  function Timer() {
    return (
      <div className="text-center mb-6">
        <h2>
          room will self-destruct in:
        </h2>
        <h1 id="time-remaining" className={`text-3xl ${montserrat.className}`}>
          {formatTime(ttl)}
        </h1>
      </div>
    )
  }

  useEffect(() => {
    const initializeKeys = async () => {
      const privateKeyData = window.sessionStorage.getItem('cinder-private');
      const publicKeyData = window.sessionStorage.getItem('cinder-public');

      if (!privateKeyData || !publicKeyData) {
        console.error('Keys not found in session storage');
        return;
      }

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
    };

    initializeKeys();

    if (process.env.NODE_ENV === 'development') {
      BASE_URL = `ws://127.0.0.1:2920`;
    } else {
      let split_url = window.location.origin.split('/');
      BASE_URL = `wss://${split_url[split_url.length-1]}`;
    }

    socket = new WebSocket(`${BASE_URL}/ws`);

    // socket.close();

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

      async function wait() {
        return new Promise((resolve, reject) => {
          const messageHandler = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'system') {
              socket.removeEventListener('message', messageHandler);
              if (data.payload.success) {
                resolve();
              } else {
                reject(new Error(data.payload.message));
              }
            }
          };
          socket.addEventListener('message', messageHandler);
        });
      }

      wait().then(() => {
        socket.send(JSON.stringify({
          type: 'handshake',
          payload: {
            public_key: JSON.parse(window.sessionStorage.getItem('cinder-public')),
            session_id: sessionID,
            nickname: window.sessionStorage.getItem('nickname'),
            room: roomID,
          }
        }));
      }).catch((error) => {
        alert('Failed to join room:', error.message);
        socket.close();
        window.location.href = '/';
      });
    };

    setInterval(() => {
      socket.send(JSON.stringify({
        type: 'heartbeat'
      }))
    }, 30000);

    socket.onmessage = async (e) => {
      let data = JSON.parse(e.data);

      switch (data.type) {
        case "handshake":
          // console.log("Recevied handshake");

          let pubkey = JSON.stringify(data.payload.public_key);
          let current_pubkey = window.sessionStorage.getItem('partner-public');

          if (data.payload.session_id === sessionID) {
            return;
          }

          if (current_pubkey && pubkey === current_pubkey) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message text-center mb-2 p-2 bg-neutral-800 rounded';
            messageElement.textContent = `${data.payload.nickname} joined the chat`;

            let chatInput = document.querySelector('#chat-input');

            // window.sessionStorage.removeItem('cinder-public');

            chatInput.parentNode.insertBefore(messageElement, chatInput)

            return;
          }

          window.sessionStorage.setItem('partner-public', pubkey);
          window.sessionStorage.setItem('partner-nickname', data.payload.nickname);

          socket.send(JSON.stringify({
            type: 'handshake',
            payload: {
              public_key: JSON.parse(window.sessionStorage.getItem('cinder-public')),
              session_id: sessionID,
              nickname: window.sessionStorage.getItem('nickname'),
              room: roomID,
            }
          }));

          break;

        case "message":
          try {
            let decrypted = await window.crypto.subtle.decrypt(
              {name: 'RSA-OAEP'},
              privkey,
              new Uint8Array(data.payload.encrypted).buffer
            );

            const decoder = new TextDecoder();
            const decryptedText = decoder.decode(decrypted);
            // console.log(decryptedText);

            const messageElement = document.createElement('div');
            messageElement.className = 'message mb-2 p-2 bg-neutral-800 rounded';
            messageElement.textContent = `${window.sessionStorage.getItem('partner-nickname')}: ${decryptedText}`;

            const chatInput = document.querySelector('#chat-input');

            if (chatInput) {
              chatInput.parentNode.insertBefore(messageElement, chatInput);
            }
          } catch (error) {
            return;
          }

          break;

        case "system":
          if (!data.payload.success) {
            socket.close();
            alert(data.payload.message);
            window.location.href = '/';
          }

          if (data.payload.ttl != null) {
            setTTL(data.payload.ttl);
          }

          setInterval(() => {
            setTTL(prev => {
              const newValue = prev > 0 ? prev - 1 : 0;

              if (newValue <= 0) {
                window.localStorage.clear();
                window.sessionStorage.clear();

                window.location.href = '/';
              }

              return newValue;
            });
          }, 1000);

          break;
      }
    }

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };

  }, []);

  return (
    <div>
      <div className="max-h-screen">
        <Navbar />
        <Timer />
        <ChatContent />
      </div>
    </div>
  );
}