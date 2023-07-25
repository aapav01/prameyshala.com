"use client";

import React from "react";
import { useSession } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function Template({ children }: Props) {
  const { status } = useSession({
    required: true,
  });
  if (status === "loading") return <main className="flex items-center justify-center min-h-[60vh]">
    <span className="text-2xl font-bold uppercase animate-pulse">Loading...</span>
  </main>;
  return <>{children}</>;
}
