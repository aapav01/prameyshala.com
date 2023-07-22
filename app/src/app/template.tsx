"use client";

import MainFooter from "@/components/main-footer";
import MainNav from "@/components/main-nav";
import React from "react";
import { SessionProvider } from "next-auth/react";

function MainTemplate({
  children,
  session,
}: {
  children: React.ReactNode,
  session: any
}) {
  return (
    <SessionProvider session={session}>
      <MainNav />
      {children}
      <MainFooter />
    </SessionProvider>
  );
}

export default MainTemplate;
