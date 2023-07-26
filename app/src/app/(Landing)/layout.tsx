import React from "react";

type Props = {
  children: React.ReactNode;
  authModal: React.ReactNode;
};

export default function LandingLayout({ children, authModal }: Props) {
  return (
    <>
      {authModal}
      {children}
    </>
  );
}
