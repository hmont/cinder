"use client";

import React, { useContext, useEffect, useState } from "react";

import { DM_Serif_Text, Montserrat } from "next/font/google";

import '../../globals.css';
import './page.css'

import 'animate.css';
import Link from "next/link";

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
      <h1 className={`text-3xl ${dmSerif.className}`}>
        <Link href='/'>
          cinder
        </Link>
      </h1>
    </div>
  );
}

export default function CreateChat() {
  useEffect(() => {
    if (process.env.DEVELOPMENT_MODE) {
      BASE_URL = `http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`;
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