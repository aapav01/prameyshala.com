"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  standard: any;
  enrolled?: boolean;
};

export default function EnrollButton({ standard, enrolled }: Props) {
  const [disabled, setDisabled] = useState(false);
  const [url, setUrl] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  const enroll = async () => {
    if (!session?.user) {
      router.push("/login?callbackUrl=" + window.location.href);
      return;
    }
    setDisabled(true);
    await fetch("/api/enroll", {
      method: "POST",
      body: JSON.stringify({ standard: standard.id }),
    })
      .then(async (res) => {
        const _data = await res.json();
        let { data } = _data.createPaymentPhonepe;
        data = JSON.parse(data);
        setUrl(data.instrumentResponse.redirectInfo.url);
        setDisabled(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (typeof window !== "undefined" && url) {
      // open url in same tab
      window.open(url, "_self");
    }
  }, [url]);

  return (
    <>
      {!enrolled && (
        <Button
          className="text-lg py-6 hover:bg-transparent border hover:border-primary hover:text-primary"
          size="lg"
          disabled={disabled}
          onClick={enroll}
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
