import MainFooter from "@/components/main-footer";
import MainNav from "@/components/main-nav";
import React from "react";

function MainTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <MainNav />
      {children}
      <MainFooter />
    </>
  );
}

export default MainTemplate;
