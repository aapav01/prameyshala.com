import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

function MainNav() {
  return (
    <nav className="">
      <div className="container flex min-h-[3rem] p-6 gap-2">
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
        <div className="flex-1 flex justify-end items-center gap-1">
          <Button variant={'outline'}>Login</Button>
          <Button className="text-xs md:text-sm">Get Started <span className="hidden md:flex">For Free</span></Button>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
