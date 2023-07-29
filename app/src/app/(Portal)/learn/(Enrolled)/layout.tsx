import React from "react";

type Props = {
  children: React.ReactNode;
  rightSidebar: React.ReactNode;
};

export default function LayoutEnroll({ children, rightSidebar }: Props) {
  return (
    <main className="flex">
      <section className="w-full min-h-[60vh]">{children}</section>
      {rightSidebar}
    </main>
  );
}
