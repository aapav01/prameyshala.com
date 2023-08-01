"use client";

import React, { useState } from "react";
import Script from "next/script";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";

type Props = {
  standard: any;
  enrolled?: boolean;
};

export default function EnrollButton({ standard, enrolled }: Props) {
  const { data: session } = useSession();
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();

  const makePayment = async (e: any) => {
    e.preventDefault();
    if (!session?.user) {
      router.push("/login?callbackUrl=" + window.location.href);
      return;
    }
    setDisabled(true);
    const res = await fetch(`/class/${standard.slug}/enroll/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // @ts-expect-error
        token: session.user.token,
        amount: standard.latestPrice,
      }),
    });
    const { createPayment } = await res.json();

    var options = {
      key: "rzp_test_3tq8ujggBnFtra",
      name: "Pramey Shala",
      description: `${standard.name} - 1 Year`,
      currency: "INR",
      amount: standard.latestPrice * 100,
      image: "/apple-icon",
      order_id: createPayment.orderGatewayId,
      handler: async function (response: any) {
        setDisabled(true);
        const payment_data = {
          // @ts-expect-error
          token: session.user.token,
          amount: parseInt(standard.latestPrice),
          standard: parseInt(standard.id),
          payment: parseInt(createPayment.id),
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        };
        const { enrollStudent } = await fetch(
          `/class/${standard.slug}/enroll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payment_data),
          }
        ).then((res) => res.json());
        router.push("/learn/" + standard.slug);
        // TODO: print invoice details
        return;
      },
      prefill: {
        // @ts-expect-error
        name: session.user.fullName,
        email: session.user.email,
        // @ts-expect-error
        contact: session.user.phoneNumber,
      },
      theme: {
        color: "#5F2DED",
      },
    };
    // @ts-expect-error
    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response: any) {
      // toast({
      //   title: "You submitted the following values:",
      //   description: (
      //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
      //       <code className="text-white">
      //         {JSON.stringify(response, null, 2)}
      //       </code>
      //     </pre>
      //   ),
      // });
    });
    paymentObject.open();
    setDisabled(false);
  };
  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      {!enrolled && (
        <Button
          className="text-lg py-6 hover:bg-transparent border hover:border-primary hover:text-primary"
          size="lg"
          onClick={makePayment}
          disabled={disabled}
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
