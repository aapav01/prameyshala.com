import React from "react";
import Image from "next/image";
import Link from "next/link";

import AppStore from "@/svg/app-store.svg";
import PlayStore from "@/svg/play-store.svg";

type Props = {};

function MainFooter({}: Props) {
  return (
    <footer className="bg-primary-deep text-indigo-300 py-8">
      <div className="container">
        <div className="border-b-2 border-indigo-900 pb-8">
          <div className="flex flex-row gap-4">
            <div className="max-w-sm">
              <Link href="/" passHref>
                <Image
                  src="/svg/logo.svg"
                  alt="Logo"
                  width={280}
                  height={48}
                  priority
                  className="invert brightness-0"
                />
              </Link>
              <p className="mt-2">
                MOTO MOTO MOTO MOTO MOTO MOTO MOTO MOTO MOTO MOTO.
              </p>
              <p className="mt-2 font-sans text-sm font-bold text-center">
                Download our apps to start learning
              </p>
              <div className="flex flex-row gap-2 p-1">
                <Image
                  src={AppStore.src}
                  alt="App Store"
                  width={150}
                  height={48}
                />
                <Image
                  src={PlayStore.src}
                  alt="Play Store"
                  width={150}
                  height={48}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 p-8 gap-4 text-lg w-full">
              <div>
                <p className="font-sans font-bold text-indigo-100">Usefull Links</p>
                <ul className="mt-2">
                  <li>About Us</li>
                  <li>Careers</li>
                  <li>Blogs</li>
                </ul>
              </div>
              <div>
                <p className="font-sans font-bold text-indigo-100">
                  Help & support
                </p>
                <ul className="mt-2">
                  <li>User Guidelines</li>
                  <li>Site Map</li>
                  <li>Refund Policy</li>
                  <li>Takedown Policy</li>
                  <li>Grievance Redressal</li>
                </ul>
              </div>
              <div>
                <p className="font-sans font-bold text-indigo-100">About us</p>
                <p className="text-sm">Call us and we will answer all your questions about us.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between pt-8 px-8">
          <p className="text-xs">
            Copyright &copy; {new Date().getFullYear()}, All Rights Reserved by
            Pramey Shala.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
