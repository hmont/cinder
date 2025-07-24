"use client";

import AOS from 'aos';

import { useEffect } from "react";

import { DM_Serif_Text, Montserrat } from "next/font/google";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faArrowUpRightFromSquare, faAnglesRight, faFire, faLock, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import 'aos/dist/aos.css';

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
          <a href="#features" className={montserrat.className}>
            <span className="mr-1 text-md w-4 h-4 inline-block">
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </span>
            start a chat
          </a>
        </p>
        <p id="" className="read-more text-white mt-2 animate__animated animate__fadeInUp">
          <a href="#features" className={montserrat.className}>
            <span className="mr-1 text-md w-3 h-3 inline-block">
              <FontAwesomeIcon icon={faArrowDown} />
            </span>
            read more
          </a>
        </p>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div id="features" className="items-center text-center">
      <div id="features-header" className="mx-auto max-w-3xl mb-8">
        <h1 data-aos="fade-down" className="header text-6xl text-white">features</h1>
        <h2 data-aos-delay="100" data-aos="fade-down" className="subhead text-gray-300 text-2xl mt-4">what makes cinder awesome.</h2>
      </div>

      <div id="features-grid" className="text-white mx-auto grid grid-cols-3 gap-14 mt-20 mb-40 max-w-4xl">
        <div id="ephemeral" data-aos="fade-up">
          <p className="text-8xl"><FontAwesomeIcon icon={faFire} /></p>
          <h2 className="text-3xl mt-6">ephemeral</h2>
          <h2 className="text-md text-gray-400 mt-4">
            all chatrooms self-destruct after 10 minutes.
            no messages or data remain on our servers. no logs, no history, no evidence.
          </h2>
        </div>
        <div id="encrypted" data-aos="fade-up" data-aos-delay="200">
          <p className="text-8xl"><FontAwesomeIcon icon={faLock} /></p>
          <h2 className="text-3xl mt-6">encrypted</h2>
          <h2 className="text-md text-gray-400 mt-4">
            all chats are end-to-end encrypted. that means no one other than
            you and the person you&apos;re chatting with can read them—not even us.
          </h2>
        </div>
        <div id="encrypted" data-aos="fade-up" data-aos-delay="400">
          <p className="text-8xl"><FontAwesomeIcon icon={faAnglesRight} /></p>
          <h2 className="text-3xl mt-6">instant</h2>
          <h2 className="text-md text-gray-400 mt-4">
            no downloads, no sign-ups, no waiting. start a private chat in seconds—then
            watch it disappear in minutes.
          </h2>
        </div>
      </div>
    </div>
  );
}

function BottomSection() {
  return (
    <div id="bottom" className="mx-auto max-w-3xl mb-40 text-center">
      <h1 data-aos-delay="100" data-aos="fade-up" className="header text-white text-4xl mt-4">ready to take back your privacy?</h1>
      <p data-aos-delay="300" data-aos="fade-up" className="start-chat text-2xl text-gray-100 mt-2">
        <a href="#features">
          <span className="mr-2">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </span>start a chat
        </a>
      </p>
    </div>
  );
}

function Footer() {
  return (
    <div id="footer" className="items-center py-8 text-white">
      <div className="grid grid-cols-2 gap-8 mx-auto max-w-4xl flex">
        <div className="inline align-middle">
          <p>
            copyright © 2025 <a
              href="https://henry.moe"
              className="underline">
                Henry Monteith
            </a> and cinder labs
          </p>
          <p>powered by <a href="https://github.com/hmont/cinder" className="underline">cinder</a>
          </p>
        </div>
        <div className="text-right flex items-center justify-end">
          <p className="text-gray-200 text-2xl hover:text-white">
            <a href="https://github.com/hmont/cinder">
                <FontAwesomeIcon icon={faGithub} />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
    });

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