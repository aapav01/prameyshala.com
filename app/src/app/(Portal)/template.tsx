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
  return <>{children}</>;
}
