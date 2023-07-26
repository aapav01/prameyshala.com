"use client";

import React, { useRef, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HamburgerMenuIcon,
  HomeIcon,
  ExitIcon,
  VideoIcon,
} from '@radix-ui/react-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function MainNav() {
  const stickyHeader = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();

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
    console.log("session", session);
  }, [session]);
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
          {status === "loading" ? null : session ? (
            <>
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded-full shadow shadow-primary/50 focus:outline-none">
                <HamburgerMenuIcon className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* @ts-expect-error */}
                <DropdownMenuLabel>{session?.user?.fullName}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-xs text-gray-400 py-0 m-0 font-thin">{session?.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/" passHref>
                  <DropdownMenuItem>
                    <HomeIcon className="mr-1" />
                    Home
                  </DropdownMenuItem>
                </Link>
                <Link href="/learn" passHref>
                  <DropdownMenuItem>
                    <VideoIcon className="mr-1" />
                    My Learning
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={()=>signOut()}>
                  <ExitIcon className="mr-1" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant={"outline"} onClick={() => signIn()}>
                Login
              </Button>
              <Button asChild className="text-xs md:text-sm">
                <Link href={'/register'}>
                  Join<span className="hidden md:flex md:ml-1">For Free</span>
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainNav;
