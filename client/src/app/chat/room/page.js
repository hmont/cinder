"use client";

import { useEffect } from "react";

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

function SendChatButton() {
  const onClick = () => {
    console.log('Button clicked!');
  };

  return (
    <button
      className="bg-neutral-700 px-8 py-2 rounded-md create"
      onClick={onClick}>
        send message
    </button>
  );
}

export default function Home() {
  useEffect(() => {

  }, []);

  return (
    <div>
      <div className="max-h-screen">
        <div id="navbar" className="w-screen flex px-4 py-4">
          <h1 className="text-3xl">
              <a href="/">
                  cinder
              </a>
          </h1>
        </div>

          <div id="content" className={`rounded-lg grow-in w-2xl px-8 py-8 mx-auto bg-neutral-900 ${montserrat.className}`}>
            <h2 className="text-2xl">
                <a href="/">
                    example chatroom
                </a>
            </h2>

            <input
              className="bg-neutral-700 rounded-md px-2 py-2 mt-6"
              placeholder="send message">

            </input>

            <div className="items-right text-right mt-6">
                <SendChatButton />
            </div>
          </div>
        </div>

      </div>
  );
}