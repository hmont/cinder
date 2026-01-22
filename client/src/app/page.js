"use client";

import Link from 'next/link';

import { motion } from "motion/react"

import { useEffect } from "react";

import { DM_Serif_Text, Montserrat } from "next/font/google";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare, faAnglesRight, faFire, faLock, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import 'animate.css';

import './homepage.css';
import './globals.css';

const dmSerif = DM_Serif_Text({
  weight: "400",
  subsets: ['latin']
});

const montserrat = Montserrat({
  weight: "400",
  subsets: ["latin"]
});

function HeroSection({ dmSerif, montserrat }) {
  return (
    <div id="hero" className="flex items-center text-center min-h-screen">
      <div id="header" className="m-auto max-w-xl">
        <h1 className={`header text-white text-8xl animate__animated animate__fadeInDown ${dmSerif.className}`}>cinder</h1>
        <h2 className={`subhead text-gray-300 text-3xl mt-4 mb-8 animate__animated animate__fadeInUp ${montserrat.className}`}>because not everything needs to last forever.</h2>
        <h3 className={`tagline text-xl text-gray-400 animate__animated animate__fadeInUp ${montserrat.className}`}>
          cinder lets you create private, encrypted, one-on-one real-time chat rooms which self-destruct after 10 minutes.
          say what you want—then watch it burn.
        </h3>
        <p id="" className="start-chat text-white mt-16 animate__animated animate__fadeInUp">
          <Link href="/chat/create" className={montserrat.className}>
            <span className="mr-1 text-md w-4 h-4 inline-block">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
            start a chat
          </Link>
        </p>
        <p id="" className="read-more text-white mt-2 animate__animated animate__fadeInUp">
          <Link href="#features" className={montserrat.className}>
            <span className="mr-1 text-md w-3 h-3 inline-block">
              <FontAwesomeIcon icon={faArrowDown} />
            </span>
            read more
          </Link>
        </p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div id="features" className="items-center text-center">
      <motion.div
          id="ephemeral"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <div id="features-header" className="mx-auto max-w-3xl mb-8">
            <h1 className="header text-6xl text-white">features</h1>
            <h2 className="subhead text-gray-300 text-2xl mt-4">what makes cinder awesome.</h2>
          </div>
        </motion.div>

      <div id="features-grid" className="text-white mx-auto grid grid-cols-3 gap-14 mt-20 mb-40 max-w-4xl">
        <motion.div
          id="ephemeral"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0 }}
        >
          <p className="text-8xl"><FontAwesomeIcon icon={faFire} /></p>
          <h2 className="text-3xl mt-6">ephemeral</h2>
          <h2 className="text-md text-gray-400 mt-4">
            all chatrooms self-destruct after 10 minutes.
            no messages or data remain on our servers. no logs, no history, no evidence.
          </h2>
        </motion.div>
        <motion.div
          id="encrypted"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <p className="text-8xl"><FontAwesomeIcon icon={faLock} /></p>
          <h2 className="text-3xl mt-6">encrypted</h2>
          <h2 className="text-md text-gray-400 mt-4">
            all chats are end-to-end encrypted. that means no one other than
            you and the person you&apos;re chatting with can read them—not even us.
          </h2>
        </motion.div>
        <motion.div
          id="instant"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <p className="text-8xl"><FontAwesomeIcon icon={faAnglesRight} /></p>
          <h2 className="text-3xl mt-6">instant</h2>
          <h2 className="text-md text-gray-400 mt-4">
            no downloads, no sign-ups, no waiting. start a private chat in seconds—then
            watch it disappear in minutes.
          </h2>
        </motion.div>
      </div>
    </div>
  );
}

function BottomSection() {
  return (
    <motion.div
      id="instant"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div id="bottom" className="mx-auto max-w-3xl mb-40 text-center">
        <h1 className="header text-white text-4xl mt-4">ready to take back your privacy?</h1>
        <p className="start-chat text-2xl text-gray-100 mt-2">
          <Link href="/chat/create">
            <span className="mr-2">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>start a chat
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

function Footer() {
  return (
    <div id="footer" className="items-center py-8 text-white">
      <div className="grid grid-cols-2 gap-8 mx-auto max-w-4xl flex">
        <div className="inline align-middle">
          <p>
            copyright © 2026 <Link
              href="https://henry.moe"
              className="underline">
                Henry Monteith
            </Link> and cinder labs
          </p>
          <p>powered by <Link href="https://github.com/hmont/cinder" className="underline">cinder</Link>
          </p>
        </div>
        <div className="text-right flex items-center justify-end">
          <p className="text-gray-200 text-2xl hover:text-white">
            <Link href="https://github.com/hmont/cinder">
                <FontAwesomeIcon icon={faGithub} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
      });
    });
  }, []);

  return (
    <div>
      <HeroSection dmSerif={dmSerif} montserrat={montserrat} />
      <FeaturesSection />
      <BottomSection />
      <Footer />
    </div>
  );
}