"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HamburgerMenuIcon,
  HomeIcon,
  ExitIcon,
  VideoIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

function MainNav() {
  const stickyHeader = useRef<HTMLElement>(null);
  const { data: session, status } = useSession();
  const [scrollPosition, setSrollPosition] = useState(0);

  useEffect(() => {
    const mainHeader = document.getElementById("mainHeader");
    let fixedTop: number =
      (stickyHeader.current?.offsetTop ? stickyHeader.current?.offsetTop : 0) +
      200;
    const fixedHeader = () => {
      if (window.scrollY > fixedTop) {
        mainHeader?.classList.add("shadow-lg");
        mainHeader?.classList.add("shadow-primary/30");
      } else {
        mainHeader?.classList.remove("shadow-lg");
        mainHeader?.classList.remove("shadow-primary/30");
      }
      if ((scrollPosition - 10) > window.scrollY) {
        mainHeader?.classList.remove("animate-out");
        mainHeader?.classList.add("animate-in");
        mainHeader?.classList.add("sticky");
      }
      if ((scrollPosition + 10) < window.scrollY) {
        mainHeader?.classList.remove("animate-in");
        mainHeader?.classList.add("animate-out");
        mainHeader?.classList.remove("sticky");
      }
      setSrollPosition(window.scrollY);
    };
    window.addEventListener("scroll", fixedHeader);
    return () => {
      window.removeEventListener("scroll", fixedHeader);
    };
  }, [session, scrollPosition]);
  return (
    <nav
      id="mainHeader"
      className="bg-background w-full z-30 animate-in duration-300 ease-in top-0 slide-in-from-top-0"
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
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle() + " gap-2"}
                      >
                        <HomeIcon />
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/learn" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle() + " gap-2"}
                      >
                        <VideoIcon />
                        My Learning
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-3 p-2 rounded-full shadow shadow-primary/50 focus:outline-none">
                  <HamburgerMenuIcon className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    {/* @ts-expect-error */}
                    {session?.user?.fullName}
                  </DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-gray-400 py-0 m-0 font-thin">
                    {session?.user?.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <PersonIcon className="mr-1" />
                    <Link href="/my-profile">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <ExitIcon className="mr-1" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant={"outline"}>
                <Link href={"/login"}>Login</Link>
              </Button>
              <Button asChild className="text-xs md:text-sm">
                <Link href={"/register"}>
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
