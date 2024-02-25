import React from "react";
import Image from "next/image";
import Link from "next/link";

import AppStore from "@/svg/app-store.svg";
import PlayStore from "@/svg/play-store.svg";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

type Props = {};

function MainFooter({}: Props) {
  return (
    <footer className="bg-primary-deep text-indigo-300 py-8">
      <div className="container">
        <div className="border-b-2 border-indigo-900 pb-8">
          <div className="flex flex-col md:flex-row gap-4">
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
              Start learning with Prameyshala
              </p>
              <p className="mt-2 font-sans text-sm font-bold text-center">
                Download our apps to start learning. (Coming Soon)
              </p>
              <div className="flex flex-row gap-2 p-1">
                <Image
                  src={AppStore.src}
                  alt="App Store"
                  width={120}
                  height={48}
                />
                <Image
                  src={PlayStore.src}
                  alt="Play Store"
                  width={120}
                  height={48}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-8 gap-4 text-lg w-full">
              <div>
                <p className="font-sans font-bold text-indigo-100">Usefull Links</p>
                <ul className="mt-2">
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/blog">Insight</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-sans font-bold text-indigo-100">
                  Help & support
                </p>
                <ul className="mt-2">
                  <li><Link href={'/privacy-policy'}>Privacy Policy</Link></li>
                  {/* <li>Site Map</li> */}
                  <li><Link href={'/refund-policy'}>Refund Policy</Link></li>
                  <li>Takedown Policy</li>
                  <li><Link href={'/terms-and-conditions'}>Terms &amp; Conditions</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-sans font-bold text-indigo-100">About us</p>
                <p className="text-sm">Contact us and we will answer all your questions about us.</p>
                <p className="mt-2">
                  <a href="mailto:contact@prameyshala.com">
                    <EnvelopeClosedIcon className="inline-block h-8 w-8 mr-2" />
                    <span className="text-lg underline underline-offset-4">
                      contact@prameyshala.com
                    </span>
                  </a>
                </p>
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
