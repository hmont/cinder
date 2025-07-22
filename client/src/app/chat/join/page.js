"use client";

import React, { useEffect } from "react";

import { v4 } from 'uuid';

import { DM_Serif_Text, Montserrat } from "next/font/google";

import '../../globals.css';
import './page.css'

import 'animate.css';

const dmSerif = DM_Serif_Text({
  weight: "400",
  subsets: ['latin']
});

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"]
});

async function generateKeypair() {
  const kp = await window.crypto.subtle.generateKey({
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    },

    true,
    ["encrypt", "decrypt"]
  );

  const pub = await window.crypto.subtle.exportKey('jwk', kp.publicKey);
  const priv = await window.crypto.subtle.exportKey('jwk', kp.privateKey);

  window.sessionStorage.setItem('cinder-public', JSON.stringify(pub));
  window.sessionStorage.setItem('cinder-private', JSON.stringify(priv));
}

function JoinRoomButton() {
  const onClick = async () => {
    const urlParams = new URLSearchParams(window.location.search);

    let roomID = urlParams.get('id');

    if (roomID == null) {
      window.location.href = '/chat/create';
    }

    await generateKeypair();

    const nicknameInput = document.querySelector('#nickname-input');
    let nickname = nicknameInput.value;

    window.sessionStorage.setItem('nickname', nickname !== null ? nickname : 'Guest');

    window.sessionStorage.setItem('room', roomID);

    window.location.href = '/chat/room';
  };

  return (
    <button
      className="bg-neutral-700 px-8 py-2 rounded-md create"
      onClick={onClick}>
        join room
    </button>
  );
}

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

function NicknameInput() {
  return (
    <div>
      <input
        id="nickname-input"
        className="bg-neutral-700 rounded-md px-2 py-2 mt-6"
        placeholder="nickname (optional)">
      </input>
      <p className="text-neutral-600 mt-2 text-sm">
        your nickname will not be encrypted end-to-end.<br></br>
        don't use your real name!
      </p>
    </div>
  );
}

function JoinChatroomContent() {
  return (
    <div id="content" className={`rounded-lg grow-in w-2xl px-8 py-8 mx-auto bg-neutral-900 ${montserrat.className}`}>
      <h2 className="text-2xl">
        <a href="/">
          joining chatroom
        </a>
      </h2>

      <NicknameInput />

      <div className="items-right text-right mt-6">
        <JoinRoomButton />
      </div>
    </div>
  );
}

export default function JoinChat() {
  useEffect(() => {
    if (window.localStorage.getItem('session-id') == null) {
      window.localStorage.setItem('session-id', v4());
    }
  }, []);

  return (
    <div>
      <div>
        <div className="max-h-screen">
          <Navbar />
          <JoinChatroomContent />
        </div>
      </div>
    </div>
  );
}