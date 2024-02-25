import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PortalLayout({ children }: Props) {
  return <main className="flex">{children}</main>;
}
