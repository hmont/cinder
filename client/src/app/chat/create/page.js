"use client";

import React, { useContext, useEffect, useState } from "react";

import { DM_Serif_Text, Montserrat } from "next/font/google";

import '../../globals.css';
import './page.css'

import config from '../../config.js';

import 'animate.css';

export const overlayContext = React.createContext(false);

const dmSerif = DM_Serif_Text({
  weight: "400",
  subsets: ['latin']
});

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"]
});

let BASE_URL;



function CreateRoomButton() {
  const onClick = async () => {
    await generateKeypair();
    await createRoom();

    // window.location.href = '/chat/room';
  };

  return (
    <button
      className="bg-neutral-700 px-8 py-2 rounded-md create"
      onClick={onClick}>
        start chatroom
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
        don't worry, your nickname will be encrypted end-to-end as well!
      </p>
    </div>
  );
}

export default function CreateChat() {
  useEffect(() => {
    if (config.DEVELOPMENT_MODE) {
      BASE_URL = `http://${config.SERVER_HOST}:${config.SERVER_PORT}`;
    } else {
      let split_url = window.location.origin.split('/');
      BASE_URL = `https://${split_url[split_url.length-1]}`;
    }

    fetch(`${BASE_URL}/api/chat/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    }).then(data => {
      return data.json();
    }).then(jsonData => {
      let roomID = jsonData.code;

      window.location.href = `/chat/join?id=${roomID}`;
    }).catch(error => {
      console.error('Error creating room:', error);
    });
  }, []);

  return (
    <div>
    </div>
  );
}