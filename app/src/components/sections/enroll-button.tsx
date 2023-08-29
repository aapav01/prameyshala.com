"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  standard: any;
  enrolled?: boolean;
};

export default function EnrollButton({ standard, enrolled }: Props) {
  const [disabled, setDisabled] = useState(false);
  return (
    <>
      {!enrolled && (
        <Button
          className="text-lg py-6 hover:bg-transparent border hover:border-primary hover:text-primary"
          size="lg"
          disabled={true}
        >
          {disabled ? (
            <ReloadIcon className="animate-spin" />
          ) : (
            "Enroll to the Class Now"
          )}
        </Button>
      )}
      {enrolled && (
        <Link passHref href={"/learn/" + standard.slug}>
          <Button>Let&apos;s Start</Button>
        </Link>
      )}
      {disabled && (
        <div
          className="relative z-50"
          aria-labelledby="modal-register"
          role="dialog"
          aria-modal="true"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="flex justify-center items-center h-80 w-80 bg-white">
                <ReloadIcon className="animate-spin h-16 w-16 text-primary mx-auto" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
