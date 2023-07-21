"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

function MainNav() {
  const stickyHeader = useRef<HTMLElement>(null);

  useEffect(() => {
    const mainHeader = document.getElementById("mainHeader");
    let fixedTop: number =
      (stickyHeader.current?.offsetTop ? stickyHeader.current?.offsetTop : 0) +
      100;
    const fixedHeader = () => {
      if (window.scrollY > fixedTop) {
        mainHeader?.classList.add("shadow-md");
        mainHeader?.classList.add("shadow-primary/30");
      } else {
        mainHeader?.classList.remove("shadow-md");
        mainHeader?.classList.remove("shadow-primary/30");
      }
    };
    window.addEventListener("scroll", fixedHeader);
  }, []);
  return (
    <nav
      id="mainHeader"
      className="bg-background w-full z-30 animate-in duration-300 ease-in top-0 sticky"
    >
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
          <Button variant={"outline"}>Login</Button>
          <Button className="text-xs md:text-sm">
            Join<span className="hidden md:flex md:ml-1">For Free</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
