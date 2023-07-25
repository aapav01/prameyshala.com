"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

type Props = {};

export default function AuthHeader({}: Props) {
  const { data: session } = useSession();
  return (
    <header className="py-12 bg-indigo-50 relative">
      <div className="container text-foreground">
        <span className="text-xl">Welcome, </span>
        {/* @ts-ignore */}
        <h1 className="text-4xl font-bold">{session?.user?.fullName}</h1>
        <p className="text-sm font-thin">{session?.user?.email}</p>
      </div>
    </header>
  );
}
