import { ReloadIcon } from "@radix-ui/react-icons";
import React from "react";

type Props = {
  params: {
    order_id: string;
  };
};

export default function SubLoading({ params }: Props) {
  return (
    <div className="container py-4">
      <div className="flex w-full items-center justify-center h-52">
        <ReloadIcon className="w-16 h-16 mx-auto text-blue-500 animate-spin" />
      </div>
    </div>
  );
}
