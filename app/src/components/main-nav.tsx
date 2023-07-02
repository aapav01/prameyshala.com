import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

function MainNav() {
  return (
    <nav className="">
      <div className="container flex min-h-[3rem] p-6">
        <div className="flex-1">
          <Link href="/" passHref>
            <Image
              src="/svg/logo.svg"
              alt="Logo"
              width={280}
              height={48}
              priority
            />
          </Link>
        </div>
        <div className="flex-1 flex justify-end items-center">
          <Button variant={'outline'} className="mr-4">Login</Button>
          <Button className="mr-4">Get Started For Free</Button>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
